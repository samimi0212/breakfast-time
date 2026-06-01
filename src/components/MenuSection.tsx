import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const visuals = [
  "/menu-brunch.png",
  "/menu-anglais.png",
  "/plateau-viennoiserie-entre-2.png",
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
    title: "Planches à partager",
    desc: "Pour un moment à plusieurs — plateaux de viennoiseries, cakes, pancakes... Posez au centre, profitez ensemble.",
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
            Menus tout compris ou produits à la carte — vous choisissez, on vous livre.
          </p>
        </div>

        {/* Split screen */}
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          {/* Gauche — Image (desktop uniquement) */}
          <div className="relative rounded-3xl overflow-hidden min-h-96 hidden lg:block">
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
                className="group flex-1 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                style={{ backgroundColor: "white", boxShadow: "var(--card-shadow)" }}
              >
                {/* Layout mobile : image à gauche + texte à droite */}
                <div className="flex lg:block">
                  {/* Vignette mobile */}
                  <div className="lg:hidden w-24 h-24 flex-shrink-0">
                    <img
                      src={visuals[option.imgIndex]}
                      alt={option.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Contenu */}
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
