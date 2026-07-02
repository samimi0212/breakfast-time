// Pré-rendu SEO : génère le HTML complet des pages du site après le build Vite,
// pour que Google et les assistants IA reçoivent du contenu directement (sans exécuter le JS).
// Usage : node scripts/prerender.mjs   (après `npm run build`)
// Les routes pré-rendues sont lues depuis public/sitemap.xml (FR), + leur équivalent /en/... (EN).

import { createServer } from "http";
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { join, extname, dirname } from "path";
import { fileURLToPath } from "url";
import puppeteerCore from "puppeteer-core";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const PORT = 4173;
// Sur Vercel, le conteneur de build n'a pas les librairies système dont Chrome a besoin :
// on utilise @sparticuz/chromium, un Chromium compilé pour tourner sans elles.
// En local (Mac/Linux avec un OS complet), on utilise le Chrome téléchargé par `puppeteer`.
const IS_VERCEL = !!process.env.VERCEL;
const CONCURRENCY = IS_VERCEL ? 2 : 4;

async function launchBrowser() {
  if (IS_VERCEL) {
    const chromium = (await import("@sparticuz/chromium")).default;
    return puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }
  const puppeteerFull = (await import("puppeteer")).default;
  return puppeteerCore.launch({
    executablePath: await puppeteerFull.executablePath(),
    headless: "new",
    args: ["--no-sandbox"],
  });
}

// Routes exclues du pré-rendu : privées, dynamiques (panier) ou sans intérêt SEO.
const EXCLUDE = ["/panier", "/commande", "/mon-compte", "/confirmation", "/mes-commandes", "/connexion", "/inscription", "/jeu"];

function getRoutesFromSitemap() {
  const xml = readFileSync(join(ROOT, "public", "sitemap.xml"), "utf-8");
  const frPaths = [...xml.matchAll(/<loc>https:\/\/www\.breakfast-time\.fr([^<]*)<\/loc>/g)]
    .map((m) => m[1] || "/")
    .filter((p) => !EXCLUDE.includes(p));
  const enPaths = frPaths.map((p) => (p === "/" ? "/en" : `/en${p}`));
  return [...frPaths, ...enPaths];
}

const BLOCKED = ["crisp.chat", "googletagmanager.com", "google-analytics.com", "supabase.co", "stripe.com"];

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

// Petit serveur statique avec fallback SPA (comme Vercel)
const server = createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  let filePath = join(DIST, urlPath);
  if (!existsSync(filePath) || urlPath.endsWith("/")) filePath = join(DIST, "index.html");
  try {
    const data = readFileSync(filePath);
    res.writeHead(200, { "Content-Type": MIME[extname(filePath)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end();
  }
});

async function renderRoute(browser, route) {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (BLOCKED.some((d) => req.url().includes(d))) req.abort();
    else req.continue();
  });

  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 300));
  const html = await page.content();
  await page.close();

  const outDir = route === "/" ? DIST : join(DIST, route);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), "<!doctype html>\n" + html.replace(/^<!doctype html>/i, ""));
  return html.length;
}

async function prerender() {
  const routes = getRoutesFromSitemap();
  await new Promise((resolve) => server.listen(PORT, resolve));
  const browser = await launchBrowser();

  let done = 0;
  let failed = 0;
  const queue = [...routes];

  async function worker() {
    while (queue.length) {
      const route = queue.shift();
      try {
        const bytes = await renderRoute(browser, route);
        done++;
        console.log(`✓ [${done}/${routes.length}] ${route} (${Math.round(bytes / 1024)} Ko)`);
      } catch (err) {
        failed++;
        console.error(`✗ ${route} :`, err.message);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  await browser.close();
  server.close();

  console.log(`\nPré-rendu terminé : ${done} pages générées, ${failed} échecs sur ${routes.length} routes.`);
  if (failed > 0) process.exit(1);
}

prerender().catch((err) => {
  console.error("Échec du pré-rendu :", err);
  process.exit(1);
});
