import { useTranslation } from "react-i18next";
import { usePageMeta } from "@/hooks/usePageMeta";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MentionsLegales = () => {
  const { t } = useTranslation();
  usePageMeta("Mentions légales | Breakfast Time", "Mentions légales de Breakfast Time, service de livraison de petits-déjeuners dans les Alpes-Maritimes.", "/mentions-legales", true);

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-3xl font-display font-bold mb-10">{t("legal.pageTitle")}</h1>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">{t("legal.s1Title")}</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {t("legal.s1Text")}<br />
            {t("common.contact")} : <a href="mailto:contact@breakfast-time.fr" className="underline hover:text-foreground transition-colors">contact@breakfast-time.fr</a>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">{t("legal.s2Title")}</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {t("legal.s2Text")}<br />
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">vercel.com</a>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">{t("legal.s3Title")}</h2>
          <p className="text-muted-foreground leading-relaxed">{t("legal.s3Text")}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">{t("legal.s4Title")}</h2>
          <p className="text-muted-foreground leading-relaxed">{t("legal.s4Text")}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">{t("legal.s5Title")}</h2>
          <p className="text-muted-foreground leading-relaxed">{t("legal.s5Text")}</p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default MentionsLegales;
