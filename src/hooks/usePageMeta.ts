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
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", `${BASE_URL}${path}`);
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
