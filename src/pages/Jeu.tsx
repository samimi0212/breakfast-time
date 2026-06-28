import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type GameState = "register" | "start" | "play" | "over";

interface ScoreEntry {
  prenom: string;
  score: number;
  rank?: number;
}

const CANVAS_W = 660;
const CANVAS_H = 360;
const ITEMS = ["🥐", "🥚", "🥯", "🧁", "🥞", "🍓", "🍞"];
const BEST_KEY = "bt_jeu_best";
const PLAT_MIN_Y = 150;
const PLAT_MAX_Y = 265;
const MAX_LIVES = 5;

// Charte Breakfast Time
const BRAND = {
  olive: "#3F5A28",
  olive2: "#5E7A34",
  lime: "#AFC23E",
  limeLt: "#D7E58A",
  cream: "#F7F6F0",
  sage: "#ECEBD8",
  border: "#DDE3B0",
};
const FONT_DISPLAY = '"Playfair Display", Georgia, serif';
const FONT_BODY = '"DM Sans", system-ui, sans-serif';
const BTN_GRADIENT = "linear-gradient(135deg, #6B8A36 0%, #AFC23E 100%)";

interface Float {
  x: number;
  y: number;
  vy: number;
  life: number;
  text: string;
  color: string;
  size: number;
}

type Platform = { x: number; y: number; w: number; h: number; color: string };

function ensurePlatforms(g: Game) {
  let rightmost = 0;
  for (const pl of g.platforms) rightmost = Math.max(rightmost, pl.x + pl.w);
  while (rightmost < CANVAS_W + 220) {
    const prevY = g.platforms.length ? g.platforms[g.platforms.length - 1].y : 240;
    const gap = 60 + Math.random() * 70 + Math.min(45, g.score * 0.02);
    let newY = prevY + (Math.random() - 0.5) * 130;
    newY = Math.max(PLAT_MIN_Y, Math.min(PLAT_MAX_Y, newY));
    const pw = 95 + Math.random() * 65;
    const newX = rightmost + gap;
    g.platforms.push({ x: newX, y: newY, w: pw, h: 18, color: Math.random() > 0.5 ? "#E6B17E" : "#D49A5E" });
    if (Math.random() < 0.65) {
      g.collectibles.push({ x: newX + pw / 2, y: newY - 26, emoji: ITEMS[Math.floor(Math.random() * ITEMS.length)], collected: false });
    }
    if (Math.random() < 0.07) {
      g.powerups.push({ x: newX + pw / 2, y: newY - 32, taken: false });
    }
    rightmost = newX + pw;
  }
}

function makeGame(best = 0) {
  const g = {
    frame: 0,
    speed: 2.6,
    score: 0,
    lives: 3,
    best,
    combo: 0,
    comboTimer: 0,
    invuln: 0,
    shake: 0,
    flash: 0,
    flashColor: "226,75,74",
    bgX: 0,
    player: { x: 80, y: 240 - 50, w: 40, h: 50, vy: 0, jumps: 0, onGround: true },
    platforms: [{ x: -40, y: 240, w: 260, h: 18, color: "#E6B17E" }] as Platform[],
    collectibles: [] as { x: number; y: number; emoji: string; collected: boolean }[],
    powerups: [] as { x: number; y: number; taken: boolean }[],
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[],
    floats: [] as Float[],
    clouds: [{ x: 100, y: 40, s: 1 }, { x: 300, y: 70, s: 0.8 }, { x: 550, y: 30, s: 1.2 }],
  };
  ensurePlatforms(g);
  return g;
}

type Game = ReturnType<typeof makeGame>;

function rectOverlap(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function spawnParticles(g: Game, x: number, y: number, color: string, n: number) {
  for (let i = 0; i < n; i++) {
    g.particles.push({ x, y, vx: (Math.random() - 0.5) * 5, vy: -Math.random() * 4 - 1, life: 1, color });
  }
}

function addFloat(g: Game, x: number, y: number, text: string, color: string, size = 18) {
  g.floats.push({ x, y, vy: -1, life: 1, text, color, size });
}

function tickGame(g: Game): { died: boolean } {
  g.frame++;
  g.bgX -= g.speed * 0.3;
  g.speed = Math.min(7, 2.6 + g.score * 0.002);

  if (g.invuln > 0) g.invuln--;
  if (g.shake > 0) g.shake *= 0.85;
  if (g.flash > 0) g.flash -= 0.06;
  if (g.comboTimer > 0) {
    g.comboTimer--;
    if (g.comboTimer === 0) g.combo = 0;
  }

  const p = g.player;
  p.vy += 0.6;
  p.y += p.vy;
  p.onGround = false;

  // plateformes : collision "une face" (on atterrit dessus)
  for (const pl of g.platforms) {
    pl.x -= g.speed;
    if (p.vy > 0 && p.y + p.h <= pl.y + 10 && p.y + p.h + p.vy >= pl.y && p.x + p.w > pl.x + 4 && p.x < pl.x + pl.w - 4) {
      p.y = pl.y - p.h;
      p.vy = 0;
      p.jumps = 0;
      p.onGround = true;
    }
  }
  g.platforms = g.platforms.filter((pl) => pl.x + pl.w > -40);
  ensurePlatforms(g);

  // collectibles
  for (const c of g.collectibles) {
    c.x -= g.speed;
    if (!c.collected && rectOverlap(p.x + 4, p.y + 4, p.w - 8, p.h - 8, c.x - 16, c.y - 16, 32, 32)) {
      c.collected = true;
      g.combo = Math.min(8, g.combo + 1);
      g.comboTimer = 110;
      const pts = 10 * Math.max(1, g.combo);
      g.score += pts;
      addFloat(g, c.x, c.y - 18, `+${pts}`, BRAND.olive, g.combo >= 2 ? 22 : 18);
      spawnParticles(g, c.x, c.y, BRAND.lime, 8);
    }
  }
  g.collectibles = g.collectibles.filter((c) => c.x > -30 && !c.collected);

  // power-up café = +1 vie
  for (const pu of g.powerups) {
    pu.x -= g.speed;
    if (!pu.taken && rectOverlap(p.x, p.y, p.w, p.h, pu.x - 18, pu.y - 18, 36, 36)) {
      pu.taken = true;
      if (g.lives < MAX_LIVES) {
        g.lives++;
        addFloat(g, pu.x, pu.y - 20, "+1 vie ❤️", "#C0392B", 20);
      } else {
        g.score += 50;
        addFloat(g, pu.x, pu.y - 20, "+50", BRAND.olive, 20);
      }
      g.flash = 0.4;
      g.flashColor = "175,194,62";
      spawnParticles(g, pu.x, pu.y, BRAND.lime, 14);
    }
  }
  g.powerups = g.powerups.filter((pu) => pu.x > -30 && !pu.taken);

  // particles & floats
  for (const pt of g.particles) { pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.15; pt.life -= 0.05; }
  g.particles = g.particles.filter((pt) => pt.life > 0);
  for (const f of g.floats) { f.y += f.vy; f.life -= 0.02; }
  g.floats = g.floats.filter((f) => f.life > 0);

  for (const c of g.clouds) { c.x -= g.speed * 0.1; if (c.x < -120) c.x = CANVAS_W + 80; }

  // chute dans le vide
  if (p.y > CANVAS_H + 30) {
    g.lives--;
    g.combo = 0;
    g.shake = 14;
    g.flash = 0.6;
    g.flashColor = "226,75,74";
    if (g.lives > 0) {
      g.platforms.unshift({ x: 10, y: 235, w: 210, h: 18, color: "#E6B17E" });
      p.x = 80;
      p.y = 235 - p.h;
      p.vy = 0;
      p.jumps = 0;
      g.invuln = 70;
    }
  }

  g.score += 0.05;
  return { died: g.lives <= 0 };
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawWorld(ctx: CanvasRenderingContext2D, g: Game) {
  const W = CANVAS_W, H = CANVAS_H;

  // ciel crème en haut, vide vert olive en bas (charte Breakfast Time)
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#F6F5E8");
  grad.addColorStop(0.45, "#E4E7C4");
  grad.addColorStop(0.78, "#8A9A45");
  grad.addColorStop(1, "#2E3D1A");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // clouds
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  for (const c of g.clouds) {
    for (const [dx, dy, r] of [[0, 0, 30], [22, 0, 24], [-18, 0, 22], [8, -14, 20], [-8, -12, 18]] as [number, number, number][]) {
      ctx.beginPath(); ctx.arc(c.x + dx * c.s, c.y + dy * c.s, r * c.s, 0, Math.PI * 2); ctx.fill();
    }
  }

  // plateformes (style tartine, opaques)
  for (const pl of g.platforms) {
    // ombre portée
    ctx.fillStyle = "rgba(40,20,5,0.22)";
    roundRectPath(ctx, pl.x + 3, pl.y + 5, pl.w, pl.h, 9);
    ctx.fill();
    // croûte (base foncée)
    ctx.fillStyle = "#9C6233";
    roundRectPath(ctx, pl.x, pl.y, pl.w, pl.h + 5, 9);
    ctx.fill();
    // dessus
    ctx.fillStyle = pl.color;
    roundRectPath(ctx, pl.x + 2, pl.y, pl.w - 4, pl.h - 1, 8);
    ctx.fill();
    // reflet
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    roundRectPath(ctx, pl.x + 8, pl.y + 3, pl.w - 16, 3, 2);
    ctx.fill();
  }

  // collectibles (avec pastille pour bien ressortir)
  ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
  for (const c of g.collectibles) {
    if (c.collected) continue;
    ctx.fillStyle = "rgba(247,246,240,0.92)";
    ctx.beginPath(); ctx.arc(c.x, c.y - 8, 17, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(175,194,62,0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(c.x, c.y - 8, 17, 0, Math.PI * 2); ctx.stroke();
    ctx.font = "26px serif";
    ctx.fillText(c.emoji, c.x, c.y);
  }

  // power-ups café (vie en plus)
  for (const pu of g.powerups) {
    if (pu.taken) continue;
    const pulse = 1 + Math.sin(g.frame * 0.15) * 0.12;
    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = BRAND.lime;
    ctx.beginPath(); ctx.arc(pu.x, pu.y - 6, 20 * pulse, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.font = "28px serif"; ctx.textAlign = "center";
    ctx.fillText("☕", pu.x, pu.y + 4);
  }

  // particles
  for (const pt of g.particles) {
    ctx.globalAlpha = Math.max(0, pt.life);
    ctx.fillStyle = pt.color;
    ctx.beginPath(); ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  // player
  const p = g.player;
  const blink = g.invuln > 0 && Math.floor(g.frame / 4) % 2 === 0;
  if (!blink) {
    const bounce = p.onGround ? Math.sin(g.frame * 0.15) * 2 : 0;
    const tilt = Math.max(-0.45, Math.min(0.45, p.vy * 0.035));
    const cx = p.x + p.w / 2;
    const cy = p.y + p.h / 2 + bounce;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(tilt);
    ctx.font = "38px serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("🥐", 0, 2);
    ctx.restore();
  }

  // floats
  ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
  for (const f of g.floats) {
    ctx.globalAlpha = Math.max(0, f.life);
    ctx.font = `bold ${f.size}px sans-serif`;
    ctx.fillStyle = f.color;
    ctx.fillText(f.text, f.x, f.y);
  }
  ctx.globalAlpha = 1;
}

function drawHUD(ctx: CanvasRenderingContext2D, g: Game) {
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  ctx.font = `bold 32px ${FONT_DISPLAY}`;
  ctx.fillStyle = BRAND.olive;
  ctx.fillText(`${Math.floor(g.score)}`, 15, 40);
  ctx.font = `600 11px ${FONT_BODY}`;
  ctx.fillStyle = BRAND.olive2;
  ctx.fillText("SCORE", 17, 54);
  if (g.best > 0) {
    ctx.fillStyle = "rgba(63,90,40,0.7)";
    ctx.font = `12px ${FONT_BODY}`;
    ctx.fillText(`🏆 Record ${Math.floor(g.best)}`, 16, 72);
  }

  ctx.textAlign = "right";
  ctx.font = "20px serif";
  ctx.fillText("❤️".repeat(Math.max(0, g.lives)) || "💀", CANVAS_W - 14, 32);

  if (g.combo >= 2) {
    const pop = 1 + Math.min(0.25, g.comboTimer / 110 * 0.25);
    ctx.save();
    ctx.translate(CANVAS_W / 2, 38);
    ctx.scale(pop, pop);
    ctx.textAlign = "center";
    ctx.font = `bold 24px ${FONT_DISPLAY}`;
    ctx.lineWidth = 4;
    ctx.strokeStyle = BRAND.cream;
    ctx.strokeText(`COMBO x${g.combo}`, 0, 0);
    ctx.fillStyle = BRAND.olive;
    ctx.fillText(`COMBO x${g.combo}`, 0, 0);
    ctx.restore();
  }
}

function drawFrame(ctx: CanvasRenderingContext2D, g: Game, dpr: number, opts: { hud: boolean; overlay?: "start" | "paused" | null; logo?: HTMLImageElement | null }) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  const shaking = g.shake > 0.5;
  if (shaking) {
    ctx.save();
    ctx.translate((Math.random() - 0.5) * g.shake, (Math.random() - 0.5) * g.shake);
  }
  drawWorld(ctx, g);
  if (shaking) ctx.restore();

  if (g.flash > 0) {
    ctx.fillStyle = `rgba(${g.flashColor},${Math.min(0.6, g.flash)})`;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }

  if (opts.hud) drawHUD(ctx, g);

  if (opts.overlay) {
    // voile vert olive (charte)
    ctx.fillStyle = "rgba(46,61,26,0.55)";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.textAlign = "center";

    if (opts.overlay === "start") {
      // panneau crème façon enseigne
      const pw = 440, ph = 214;
      const px = (CANVAS_W - pw) / 2, py = (CANVAS_H - ph) / 2;
      ctx.fillStyle = "rgba(31,41,18,0.35)";
      roundRectPath(ctx, px + 4, py + 6, pw, ph, 18); ctx.fill();
      ctx.fillStyle = BRAND.cream;
      roundRectPath(ctx, px, py, pw, ph, 18); ctx.fill();
      ctx.strokeStyle = BRAND.border; ctx.lineWidth = 2;
      roundRectPath(ctx, px, py, pw, ph, 18); ctx.stroke();

      if (opts.logo && opts.logo.complete && opts.logo.naturalWidth) {
        const lw = 232, lh = lw * (opts.logo.naturalHeight / opts.logo.naturalWidth);
        ctx.drawImage(opts.logo, CANVAS_W / 2 - lw / 2, py + 16, lw, lh);
      } else {
        ctx.fillStyle = BRAND.olive;
        ctx.font = `700 34px ${FONT_DISPLAY}`;
        ctx.fillText("Breakfast Time", CANVAS_W / 2, py + 70);
      }
      ctx.fillStyle = BRAND.olive;
      ctx.font = `600 16px ${FONT_BODY}`;
      ctx.fillText("Clic ou Espace pour commencer", CANVAS_W / 2, py + ph - 44);
      ctx.fillStyle = BRAND.olive2;
      ctx.font = `13px ${FONT_BODY}`;
      ctx.fillText("Saute de plateforme en plateforme  •  évite le vide  •  ☕ = 1 vie", CANVAS_W / 2, py + ph - 20);
    } else {
      const pw = 320, ph = 120;
      const px = (CANVAS_W - pw) / 2, py = (CANVAS_H - ph) / 2;
      ctx.fillStyle = BRAND.cream;
      roundRectPath(ctx, px, py, pw, ph, 16); ctx.fill();
      ctx.strokeStyle = BRAND.border; ctx.lineWidth = 2;
      roundRectPath(ctx, px, py, pw, ph, 16); ctx.stroke();
      ctx.fillStyle = BRAND.olive;
      ctx.font = `700 30px ${FONT_DISPLAY}`;
      ctx.fillText("⏸ Pause", CANVAS_W / 2, py + 52);
      ctx.fillStyle = BRAND.olive2;
      ctx.font = `15px ${FONT_BODY}`;
      ctx.fillText("Espace / Clic pour reprendre", CANVAS_W / 2, py + 84);
    }
  }
}

export default function Jeu() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game>(makeGame());
  const rafRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const dprRef = useRef(1);
  const bestRef = useRef(0);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const [gameState, setGameState] = useState<GameState>("register");
  const [finalScore, setFinalScore] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [leaderboard, setLeaderboard] = useState<ScoreEntry[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [playerInfo, setPlayerInfo] = useState<{ prenom: string; email: string } | null>(null);

  // Restore player info + best score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bt_jeu_player");
    if (saved) {
      setPlayerInfo(JSON.parse(saved));
      setGameState("start");
    }
    const b = Number(localStorage.getItem(BEST_KEY) || 0);
    bestRef.current = Number.isFinite(b) ? b : 0;
  }, []);

  // Précharge le logo + les polices de marque pour le rendu canvas
  useEffect(() => {
    const img = new Image();
    img.src = "/logo.png";
    img.onload = () => { logoRef.current = img; };
    const f = (document as Document & { fonts?: { load: (s: string) => Promise<unknown> } }).fonts;
    if (f) {
      f.load(`700 32px ${FONT_DISPLAY}`).catch(() => {});
      f.load(`600 16px ${FONT_BODY}`).catch(() => {});
    }
  }, []);

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from("jeu_scores")
      .select("prenom, score")
      .order("score", { ascending: false })
      .limit(10);
    if (data) setLeaderboard(data);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const submitScore = async (score: number, info: { prenom: string; email: string }) => {
    const { data: existing } = await supabase
      .from("jeu_scores")
      .select("id, score")
      .eq("email", info.email)
      .single();

    if (existing) {
      if (score > existing.score) {
        await supabase.from("jeu_scores").update({ score, prenom: info.prenom }).eq("id", existing.id);
      }
    } else {
      await supabase.from("jeu_scores").insert({ prenom: info.prenom, email: info.email, score });
    }

    const { count } = await supabase
      .from("jeu_scores")
      .select("*", { count: "exact", head: true })
      .gt("score", score);
    setMyRank((count ?? 0) + 1);
    fetchLeaderboard();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom.trim()) return setFormError("Entre ton prénom");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setFormError("Email invalide");
    const info = { prenom: prenom.trim(), email: email.trim().toLowerCase() };
    localStorage.setItem("bt_jeu_player", JSON.stringify(info));
    setPlayerInfo(info);
    setFormError("");
    setGameState("start");
  };

  const startGame = () => {
    gameRef.current = makeGame(bestRef.current);
    pausedRef.current = false;
    setIsNewRecord(false);
    setMyRank(null);
    setGameState("play");
  };

  const setupCanvas = (canvas: HTMLCanvasElement) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;
    canvas.width = CANVAS_W * dpr;
    canvas.height = CANVAS_H * dpr;
    return canvas.getContext("2d")!;
  };

  // Boucle de jeu
  useEffect(() => {
    if (gameState !== "play") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = setupCanvas(canvas);

    const loop = () => {
      const g = gameRef.current;
      if (pausedRef.current) {
        drawFrame(ctx, g, dprRef.current, { hud: true, overlay: "paused", logo: logoRef.current });
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      const { died } = tickGame(g);
      drawFrame(ctx, g, dprRef.current, { hud: true });
      if (died) {
        const score = Math.floor(g.score);
        setFinalScore(score);
        const newRecord = score > bestRef.current;
        if (newRecord) {
          bestRef.current = score;
          localStorage.setItem(BEST_KEY, String(score));
        }
        setIsNewRecord(newRecord);
        setGameState("over");
        setSubmitting(true);
        if (playerInfo) {
          submitScore(score, playerInfo).finally(() => setSubmitting(false));
        }
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [gameState, playerInfo]);

  // Écran d'accueil animé
  useEffect(() => {
    if (gameState !== "start") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = setupCanvas(canvas);
    const g = gameRef.current;
    const loop = () => {
      g.frame++;
      for (const c of g.clouds) { c.x -= 0.3; if (c.x < -120) c.x = CANVAS_W + 80; }
      drawFrame(ctx, g, dprRef.current, { hud: false, overlay: "start", logo: logoRef.current });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [gameState]);

  const jump = () => {
    const p = gameRef.current.player;
    if (p.jumps < 2) { p.vy = -13; p.jumps++; }
  };

  const handlePrimaryAction = () => {
    if (gameState === "start") return startGame();
    if (gameState === "play") {
      if (pausedRef.current) { pausedRef.current = false; return; }
      return jump();
    }
  };

  // Clavier : saut + pause
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault();
        handlePrimaryAction();
      } else if (e.code === "KeyP" && gameState === "play") {
        pausedRef.current = !pausedRef.current;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameState]);

  // Auto-pause quand l'onglet passe en arrière-plan
  useEffect(() => {
    const onHide = () => { if (document.hidden && gameState === "play") pausedRef.current = true; };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [gameState]);

  const card: React.CSSProperties = { background: "#fff", borderRadius: "16px", border: `1px solid ${BRAND.border}`, boxShadow: "0 4px 24px rgba(63,90,40,0.1)" };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${BRAND.cream} 0%, ${BRAND.sage} 100%)`, padding: "2rem 1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>

      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <img src="/logo.png" alt="Breakfast Time" style={{ height: "62px", width: "auto", marginBottom: "6px" }} />
        <h1 style={{ fontSize: "20px", fontWeight: 700, fontFamily: FONT_DISPLAY, color: BRAND.olive, marginBottom: "2px" }}>🏆 Jeu Concours</h1>
        <p style={{ color: BRAND.olive2, fontSize: "14px" }}>Fais le meilleur score et gagne un brunch offert !</p>
      </div>

      {/* Register form */}
      {gameState === "register" && (
        <div style={{ ...card, padding: "2rem", maxWidth: "400px", width: "100%" }}>
          <p style={{ marginBottom: "1.5rem", color: "#666", fontSize: "15px", lineHeight: 1.6 }}>
            Entre ton prénom et ton email pour participer — ton meilleur score sera enregistré automatiquement.
          </p>
          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              type="text"
              placeholder="Ton prénom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              style={{ padding: "12px 16px", borderRadius: "10px", border: "1.5px solid #E8C49A", fontSize: "15px", outline: "none" }}
            />
            <input
              type="email"
              placeholder="Ton email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: "12px 16px", borderRadius: "10px", border: "1.5px solid #E8C49A", fontSize: "15px", outline: "none" }}
            />
            {formError && <p style={{ color: "#E24B4A", fontSize: "13px" }}>{formError}</p>}
            <button type="submit" style={{ padding: "14px", borderRadius: "10px", background: BTN_GRADIENT, color: "#fff", fontWeight: 700, fontSize: "16px", border: "none", cursor: "pointer", boxShadow: "0 3px 10px rgba(63,90,40,0.25)" }}>
              Je joue ! 🎮
            </button>
          </form>
          <p style={{ marginTop: "12px", fontSize: "11px", color: "#aaa", textAlign: "center" }}>Email utilisé uniquement pour te contacter si tu gagnes.</p>
        </div>
      )}

      {/* Game */}
      {(gameState === "start" || gameState === "play" || gameState === "over") && (
        <>
          {/* Barre d'infos statiques (le score/vies en direct sont dessinés sur le canvas) */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { label: "Joueur", value: playerInfo?.prenom ?? "" },
              { label: "Ton record", value: bestRef.current > 0 ? String(Math.floor(bestRef.current)) : "—" },
            ].map(({ label, value }) => (
              <div key={label} style={{ ...card, padding: "8px 18px", textAlign: "center", boxShadow: "none" }}>
                <div style={{ fontSize: "11px", color: BRAND.olive2, marginBottom: "2px" }}>{label}</div>
                <div style={{ fontSize: "18px", fontWeight: 600, color: BRAND.olive }}>{value}</div>
              </div>
            ))}
          </div>

          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            onClick={handlePrimaryAction}
            style={{ borderRadius: "12px", border: "2px solid #E8C49A", cursor: "pointer", width: "100%", maxWidth: `${CANVAS_W}px`, aspectRatio: `${CANVAS_W} / ${CANVAS_H}`, touchAction: "none", display: "block" }}
          />

          <p style={{ fontSize: "12px", color: BRAND.olive2 }}>Espace / Tap pour sauter (double saut !) — P pour mettre en pause</p>
        </>
      )}

      {/* Game Over */}
      {gameState === "over" && (
        <div style={{ ...card, padding: "1.5rem 2rem", maxWidth: "440px", width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>{isNewRecord ? "🎉" : "🎯"}</div>
          {isNewRecord && (
            <p style={{ color: BRAND.olive2, fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>Nouveau record personnel !</p>
          )}
          <h2 style={{ fontSize: "22px", fontWeight: 700, fontFamily: FONT_DISPLAY, color: BRAND.olive, marginBottom: "4px" }}>Score final : {finalScore}</h2>
          {submitting ? (
            <p style={{ color: BRAND.olive2, fontSize: "14px" }}>Enregistrement...</p>
          ) : (
            myRank && (
              <p style={{ color: myRank <= 3 ? BRAND.olive : BRAND.olive2, fontWeight: myRank <= 3 ? 700 : 400, fontSize: "15px", marginBottom: "4px" }}>
                {myRank === 1 ? "🏆 Tu es 1er — bravo !" : myRank === 2 ? "🥈 2e place !" : myRank === 3 ? "🥉 3e place !" : `Tu es ${myRank}e au classement`}
              </p>
            )
          )}
          <button
            onClick={startGame}
            style={{ marginTop: "16px", padding: "12px 32px", borderRadius: "10px", background: BTN_GRADIENT, color: "#fff", fontWeight: 700, fontSize: "15px", border: "none", cursor: "pointer", boxShadow: "0 3px 10px rgba(63,90,40,0.25)" }}
          >
            Rejouer 🔄
          </button>
        </div>
      )}

      {/* Leaderboard */}
      <div style={{ ...card, padding: "1.5rem", maxWidth: "440px", width: "100%" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, fontFamily: FONT_DISPLAY, color: BRAND.olive, marginBottom: "1rem", textAlign: "center" }}>🏆 Classement</h2>
        {leaderboard.length === 0 ? (
          <p style={{ textAlign: "center", color: "#aaa", fontSize: "14px" }}>Sois le premier à jouer !</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {leaderboard.map((entry, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px",
                  borderRadius: "10px",
                  background: i === 0 ? "#FFF8DC" : i === 1 ? "#F5F5F5" : i === 2 ? "#FFF0E0" : "transparent",
                  border: i < 3 ? "1px solid #F5DEB3" : "none",
                }}
              >
                <span style={{ fontSize: "20px", width: "28px", textAlign: "center" }}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}
                </span>
                <span style={{ flex: 1, fontWeight: i < 3 ? 600 : 400, color: BRAND.olive }}>{entry.prenom}</span>
                <span style={{ fontWeight: 700, color: BRAND.olive2, fontSize: "16px" }}>{Math.floor(entry.score)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
