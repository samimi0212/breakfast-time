import { useTranslation } from "react-i18next";
import { localizePath } from "@/lib/i18nPaths";

/**
 * Retourne une fonction `lp(path)` qui préfixe le chemin par /en
 * si la langue active est l'anglais. À utiliser pour tous les href
 * et navigate() internes au site.
 */
export const useLangPath = () => {
  const { i18n } = useTranslation();
  const lp = (path: string) => localizePath(path, i18n.language);
  return { lp, lang: i18n.language };
};
