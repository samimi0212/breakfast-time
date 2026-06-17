import { Clock, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLangPath } from "@/hooks/useLangPath";
import heroImg from "@/assets/hero-breakfast.jpg";

const FinalCTA = () => {
  const { t } = useTranslation();
  const { lp } = useLangPath();

  const stats = [
    { icon: Clock, value: t("finalCta.stat1Value"), label: t("finalCta.stat1Label") },
    { icon: Star,  value: t("finalCta.stat2Value"), label: t("finalCta.stat2Label") },
    { icon: Star,  value: t("finalCta.stat3Value"), label: t("finalCta.stat3Label") },
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, hsla(61, 45%, 20%, 0.92) 0%, hsla(30, 10%, 8%, 0.85) 100%)" }}
      />
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-8"
          style={{
            backgroundColor: "rgba(223, 240, 87, 0.15)",
            border: "1px solid rgba(223, 240, 87, 0.4)",
            color: "#DFF057",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          {t("finalCta.badge")}
        </div>
        <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight" style={{ color: "white" }}>
          {t("finalCta.title")}{" "}
          <span className="italic" style={{ color: "#DFF057" }}>
            {t("finalCta.titleHighlight")}
          </span>
        </h2>
        <p
          className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          {t("finalCta.subtitle")}
        </p>
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <stat.icon size={16} style={{ color: "#DFF057" }} />
                <span className="text-2xl font-display font-bold" style={{ color: "white" }}>
                  {stat.value}
                </span>
              </div>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <a
            href={lp("/carte")}
            className="flex items-center justify-center gap-2 px-10 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
          >
            {t("finalCta.cta")}
          </a>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
