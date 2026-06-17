import { useEffect } from "react";

const BASE_URL = "https://www.breakfast-time.fr";

export function usePageMeta(
  title: string,
  description: string,
  path?: string,
  noindex?: boolean
) {
  useEffect(() => {
    document.title = title;

    const descMeta = document.querySelector("meta[name='description']");
    if (descMeta) descMeta.setAttribute("content", description);

    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (path !== undefined) {
      // Derive the FR path (strip /en prefix if present)
      const frPath = path.startsWith("/en") ? path.slice(3) || "/" : path;
      const canonicalPath = frPath;

      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", `${BASE_URL}${canonicalPath}`);

      // hreflang
      document.querySelectorAll("link[rel='alternate'][hreflang]").forEach((el) => el.remove());
      const addHreflang = (lang: string, href: string) => {
        const link = document.createElement("link");
        link.setAttribute("rel", "alternate");
        link.setAttribute("hreflang", lang);
        link.setAttribute("href", href);
        document.head.appendChild(link);
      };
      addHreflang("fr", `${BASE_URL}${frPath}`);
      addHreflang("en", `${BASE_URL}/en${frPath}`);
      addHreflang("x-default", `${BASE_URL}${frPath}`);
    }

    let robotsMeta = document.querySelector("meta[name='robots']") as HTMLMetaElement | null;
    if (noindex) {
      if (!robotsMeta) {
        robotsMeta = document.createElement("meta");
        robotsMeta.setAttribute("name", "robots");
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute("content", "noindex, nofollow");
    } else if (robotsMeta) {
      robotsMeta.setAttribute("content", "index, follow");
    }
  }, [title, description, path, noindex]);
}
