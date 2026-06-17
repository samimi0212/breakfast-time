import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import fr from "@/locales/fr.json";
import en from "@/locales/en.json";

// Détermine la langue initiale à partir du préfixe d'URL (/en/...) en priorité,
// sinon depuis le localStorage, sinon FR par défaut.
const getInitialLanguage = (): "fr" | "en" => {
  if (typeof window !== "undefined") {
    if (window.location.pathname.startsWith("/en")) return "en";
    const stored = window.localStorage.getItem("bt_language");
    if (stored === "en" || stored === "fr") return stored;
  }
  return "fr";
};

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: getInitialLanguage(),
  fallbackLng: "fr",
  interpolation: {
    escapeValue: false,
  },
});

// Set initial html lang immediately
if (typeof window !== "undefined") {
  document.documentElement.lang = getInitialLanguage();
}

i18n.on("languageChanged", (lng) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("bt_language", lng);
    document.documentElement.lang = lng;
  }
});

export default i18n;
