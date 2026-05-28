import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const visuals = [
  "/menu-brunch.png",
  "/menu-anglais.png",
  "https://static.wixstatic.com/media/21c6e4_a7461066fb7542869e337fd7e3ef7d9a~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_a7461066fb7542869e337fd7e3ef7d9a~mv2.png",
];

const options = [
  {
    title: "Nos Menus",
    desc: "Des formules pensées pour vous — tout est inclus, choisissez vos options. Du Menu Français au Brunch complet, on s'occupe de tout.",
    cta: "Voir les menus",
    link: "/carte?tab=menus",
    imgIndex: 0,
  },
  {
    title: "Composez votre Brunch",
    desc: "Viennoiseries, pains, salé, sucré, boissons... Choisissez chaque élément à la carte et créez le brunch parfait selon vos envies.",
    cta: "Explorer la carte",
    link: "/carte?tab=carte",
    imgIndex: 1,
  },
  {
    title: "Plateaux & Planches",
    desc: "Pour un moment à plusieurs — plateaux de viennoiseries, planches de fromages ou de charcuterie. Posez au centre, profitez ensemble.",
    cta: "Découvrir",
    link: "/carte?tab=carte&cat=À Partager",
    imgIndex: 2,
  },
];

const MenuSection = () => {
  const navigate = useNavigate();
  const [activeImg, setActiveImg] = useState(0);

  return (
    <section id="menu" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Titre */}
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Petit-déjeuner & Brunch</p>
          <h2 className="section-title mb-4">
            Composez votre matin{" "}
            <span className="italic" style={{ color: "#DFF057" }}>
              idéal
            </span>
          </h2>
          <p className="section-subtitle mx-auto">
            Menus tout compris ou produits à la carte — vous choisissez, on livre en 45 minutes.
          </p>
        </div>

        {/* Split screen */}
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          {/* Gauche — Image */}
          <div className="relative rounded-3xl overflow-hidden min-h-96">
            {visuals.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  activeImg === i ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Droite — Options */}
          <div className="flex flex-col gap-4">
            {options.map((option, i) => (
              <div
                key={i}
                onMouseEnter={() => setActiveImg(option.imgIndex)}
                onClick={() => navigate(option.link)}
                className="group flex-1 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                style={{ backgroundColor: "white", boxShadow: "var(--card-shadow)" }}
              >
                <h3 className="font-display text-2xl font-bold mb-2">{option.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{option.desc}</p>
                <span
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full transition-all group-hover:gap-3"
                  style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
                >
                  {option.cta}
                  <ArrowRight size={14} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
