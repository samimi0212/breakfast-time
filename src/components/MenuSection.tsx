import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLangPath } from "@/hooks/useLangPath";

const visuals = [
  "/menu-brunch.png",
  "/menu-anglais.png",
  "/plateau-viennoiserie-entre-2.png",
];

const MenuSection = () => {
  const { t } = useTranslation();
  const { lp } = useLangPath();
  const navigate = useNavigate();
  const [activeImg, setActiveImg] = useState(0);

  const options = [
    { title: t("menuSection.o1Title"), desc: t("menuSection.o1Desc"), cta: t("menuSection.o1Cta"), link: lp("/carte") + "?tab=menus", imgIndex: 0 },
    { title: t("menuSection.o2Title"), desc: t("menuSection.o2Desc"), cta: t("menuSection.o2Cta"), link: lp("/carte") + "?tab=carte", imgIndex: 1 },
    { title: t("menuSection.o3Title"), desc: t("menuSection.o3Desc"), cta: t("menuSection.o3Cta"), link: lp("/carte") + "?tab=carte&cat=À Partager", imgIndex: 2 },
  ];

  return (
    <section id="menu" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">{t("menuSection.label")}</p>
          <h2 className="section-title mb-4">
            {t("menuSection.title")}{" "}
            <span className="italic" style={{ color: "#DFF057" }}>{t("menuSection.titleHighlight")}</span>
          </h2>
          <p className="section-subtitle mx-auto">{t("menuSection.subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          {/* Image desktop */}
          <div className="relative rounded-3xl overflow-hidden min-h-96 hidden lg:block">
            {visuals.map((src, i) => (
              <img key={i} src={src} alt="" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${activeImg === i ? "opacity-100" : "opacity-0"}`} />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Options */}
          <div className="flex flex-col gap-4">
            {options.map((option, i) => (
              <div
                key={i}
                onMouseEnter={() => setActiveImg(option.imgIndex)}
                onClick={() => navigate(option.link)}
                className="group flex-1 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                style={{ backgroundColor: "white", boxShadow: "var(--card-shadow)" }}
              >
                <div className="flex lg:block">
                  <div className="lg:hidden w-24 h-24 flex-shrink-0">
                    <img src={visuals[option.imgIndex]} alt={option.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 lg:p-6 flex flex-col justify-center flex-1">
                    <h3 className="font-display text-lg lg:text-2xl font-bold mb-1 lg:mb-2">{option.title}</h3>
                    <p className="text-muted-foreground text-xs lg:text-sm leading-relaxed mb-3 lg:mb-4 hidden sm:block">{option.desc}</p>
                    <span
                      className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-3 py-1.5 lg:px-4 lg:py-2 rounded-full transition-all group-hover:gap-3 self-start"
                      style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
                    >
                      {option.cta}
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
