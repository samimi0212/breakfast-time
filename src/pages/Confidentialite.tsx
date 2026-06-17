import { useTranslation } from "react-i18next";
import { usePageMeta } from "@/hooks/usePageMeta";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Confidentialite = () => {
  const { t } = useTranslation();
  usePageMeta("Politique de confidentialité | Breakfast Time", "Politique de confidentialité et traitement des données personnelles de Breakfast Time.", "/confidentialite", true);

  const s2Items = t("privacy.s2Items", { returnObjects: true }) as string[];
  const s3Items = t("privacy.s3Items", { returnObjects: true }) as string[];
  const s7Items = t("privacy.s7Items", { returnObjects: true }) as string[];

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-3xl font-display font-bold mb-10">{t("privacy.pageTitle")}</h1>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">{t("privacy.s1Title")}</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {t("privacy.s1Text")}<br />
            RGPD : <a href="mailto:contact@breakfast-time.fr" className="underline hover:text-foreground transition-colors">contact@breakfast-time.fr</a>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">{t("privacy.s2Title")}</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">{t("privacy.s2Intro")}</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            {s2Items.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">{t("privacy.s3Title")}</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">{t("privacy.s3Intro")}</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            {s3Items.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">{t("privacy.s4Title")}</h2>
          <p className="text-muted-foreground leading-relaxed">{t("privacy.s4Text")}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">{t("privacy.s5Title")}</h2>
          <p className="text-muted-foreground leading-relaxed">{t("privacy.s5Text")}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">{t("privacy.s6Title")}</h2>
          <p className="text-muted-foreground leading-relaxed">{t("privacy.s6Text")}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">{t("privacy.s7Title")}</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">{t("privacy.s7Intro")}</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            {s7Items.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-3">
            {t("privacy.s7Footer").split("contact@breakfast-time.fr")[0]}
            <a href="mailto:contact@breakfast-time.fr" className="underline hover:text-foreground transition-colors">contact@breakfast-time.fr</a>
            {t("privacy.s7Footer").split("contact@breakfast-time.fr")[1]?.split("www.cnil.fr")[0]}
            {t("privacy.s7Footer").includes("www.cnil.fr") && (
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">www.cnil.fr</a>
            )}
            {t("privacy.s7Footer").split("www.cnil.fr")[1]}
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">{t("privacy.s8Title")}</h2>
          <p className="text-muted-foreground leading-relaxed">{t("privacy.s8Text")}</p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Confidentialite;
