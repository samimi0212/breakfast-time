import { useTranslation } from "react-i18next";
import { usePageMeta } from "@/hooks/usePageMeta";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CGV = () => {
  const { t } = useTranslation();
  usePageMeta("Conditions Générales de Vente | Breakfast Time", "Conditions générales de vente de Breakfast Time, service de livraison de petits-déjeuners dans les Alpes-Maritimes.", "/cgv", true);

  const sections = [
    { title: t("cgv.s1Title"), text: t("cgv.s1Text"), isAddress: true },
    { title: t("cgv.s2Title"), text: t("cgv.s2Text") },
    { title: t("cgv.s3Title"), text: t("cgv.s3Text") },
    { title: t("cgv.s4Title"), text: t("cgv.s4Text") },
    { title: t("cgv.s5Title"), text: t("cgv.s5Text") },
    { title: t("cgv.s6Title"), text: t("cgv.s6Text") },
    { title: t("cgv.s7Title"), text: t("cgv.s7Text") },
    { title: t("cgv.s8Title"), text: t("cgv.s8Text") },
    { title: t("cgv.s9Title"), text: t("cgv.s9Text"), hasEmail: true },
    { title: t("cgv.s10Title"), text: t("cgv.s10Text") },
  ];

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-3xl font-display font-bold mb-10">{t("cgv.pageTitle")}</h1>
        {sections.map((s, i) => (
          <section key={i} className={i < sections.length - 1 ? "mb-10" : ""}>
            <h2 className="text-lg font-semibold mb-3">{s.title}</h2>
            {s.isAddress ? (
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {s.text}<br />
                {t("common.contact")} : <a href="mailto:contact@breakfast-time.fr" className="underline hover:text-foreground transition-colors">contact@breakfast-time.fr</a>
              </p>
            ) : s.hasEmail ? (
              <p className="text-muted-foreground leading-relaxed">
                {s.text.split("contact@breakfast-time.fr")[0]}
                <a href="mailto:contact@breakfast-time.fr" className="underline hover:text-foreground transition-colors">contact@breakfast-time.fr</a>
                {s.text.split("contact@breakfast-time.fr")[1]}
              </p>
            ) : (
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{s.text}</p>
            )}
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
};

export default CGV;
