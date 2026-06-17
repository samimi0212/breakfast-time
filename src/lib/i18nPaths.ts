// Utilitaires pour gérer les chemins bilingues (/carte vs /en/carte)

/** Retire un éventuel préfixe /en d'un chemin. */
export const stripLangPrefix = (path: string): string => {
  if (path === "/en") return "/";
  if (path.startsWith("/en/")) return path.slice(3) || "/";
  return path;
};

/** Construit le chemin équivalent dans la langue donnée. */
export const localizePath = (path: string, lang: string): string => {
  const base = stripLangPrefix(path);
  if (lang === "en") {
    return base === "/" ? "/en" : `/en${base}`;
  }
  return base;
};
