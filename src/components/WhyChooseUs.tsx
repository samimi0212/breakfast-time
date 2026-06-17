import { Leaf, MapPin, Clock, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

const WhyChooseUs = () => {
  const { t } = useTranslation();

  const benefits = [
    { icon: Leaf,   title: t("why.b1Title"), desc: t("why.b1Desc") },
    { icon: MapPin, title: t("why.b2Title"), desc: t("why.b2Desc") },
    { icon: Clock,  title: t("why.b3Title"), desc: t("why.b3Desc") },
    { icon: Award,  title: t("why.b4Title"), desc: t("why.b4Desc") },
  ];

  return (
    <section className="section-padding bg-foreground" style={{ color: "hsl(var(--background))" }}>
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">{t("why.label")}</p>
        <h2 className="section-title mb-4" style={{ color: "hsl(var(--background))" }}>{t("why.title")}</h2>
        <p className="section-subtitle mx-auto mb-16" style={{ color: "hsl(var(--background) / 0.6)" }}>
          {t("why.subtitle")}
        </p>
        {/* Desktop */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((b, i) => (
            <div key={i} className="text-center group">
              <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary transition-colors duration-300">
                <b.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{b.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--background) / 0.6)" }}>{b.desc}</p>
            </div>
          ))}
        </div>
        {/* Mobile */}
        <div className="flex flex-col gap-4 sm:hidden">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl px-4 py-3" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                <b.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-display text-base font-semibold mb-0.5">{b.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--background) / 0.6)" }}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
