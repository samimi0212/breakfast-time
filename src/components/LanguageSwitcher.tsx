import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { localizePath } from "@/lib/i18nPaths";

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher = ({ className = "" }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const switchTo = (lang: "fr" | "en") => {
    if (lang === i18n.language) return;
    i18n.changeLanguage(lang);
    navigate(localizePath(location.pathname, lang) + location.search, { replace: true });
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={() => switchTo("fr")}
        aria-label="Passer en français"
        title="Français"
        className={`text-lg leading-none transition-opacity ${
          i18n.language === "fr" ? "opacity-100" : "opacity-40 hover:opacity-70"
        }`}
      >
        🇫🇷
      </button>
      <button
        onClick={() => switchTo("en")}
        aria-label="Switch to English"
        title="English"
        className={`text-lg leading-none transition-opacity ${
          i18n.language === "en" ? "opacity-100" : "opacity-40 hover:opacity-70"
        }`}
      >
        🇬🇧
      </button>
    </div>
  );
};

export default LanguageSwitcher;
