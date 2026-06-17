import { useTranslation } from "react-i18next";
import { useLangPath } from "@/hooks/useLangPath";
import aboutImg from "@/assets/about-lifestyle.jpg";

const AboutSection = () => {
  const { t } = useTranslation();
  const { lp } = useLangPath();

  return (
    <section id="about" className="section-padding">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="rounded-3xl overflow-hidden">
          <img
            src={aboutImg}
            alt={t("about.imgAlt")}
            className="w-full h-full object-cover aspect-[4/3]"
            loading="lazy"
          />
        </div>
        <div>
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">{t("about.label")}</p>
          <h2 className="section-title mb-6">{t("about.title")}</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>{t("about.p1")}</p>
            <p>{t("about.p2")}</p>
            <p>{t("about.p3")}</p>
          </div>
          <a
            href={lp("/carte")}
            className="inline-block mt-8 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            {t("about.cta")}
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
