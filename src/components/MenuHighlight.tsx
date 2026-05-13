import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const MenuSection = () => {
  const navigate = useNavigate();
  const [activeImg, setActiveImg] = useState(0);

  const visuals = [
    "https://static.wixstatic.com/media/21c6e4_137b677c57ed4588b83a5cd2f9c99169~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_137b677c57ed4588b83a5cd2f9c99169~mv2.png",
    "https://static.wixstatic.com/media/21c6e4_35577f9aced14c51b49fc307bf7656d6~mv2.jpg/v1/fill/w_917,h_917,al_c,q_85,enc_avif,quality_auto/21c6e4_35577f9aced14c51b49fc307bf7656d6~mv2.jpg",
    "https://static.wixstatic.com/media/21c6e4_a7461066fb7542869e337fd7e3ef7d9a~mv2.png/v1/fill/w_980,h_980,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_a7461066fb7542869e337fd7e3ef7d9a~mv2.png",
    "https://static.wixstatic.com/media/21c6e4_a4aec83b7dd54ab48764a13c365dab08~mv2.jpg/v1/fill/w_980,h_980,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/21c6e4_a4aec83b7dd54ab48764a13c365dab08~mv2.jpg",
  ];

  const options = [
    {
      title: "Nos Menus",
      desc: "Des formules pensées pour vous — tout est inclus, rien à choisir. Du Menu Français au Brunch complet, on s'occupe de tout.",
      cta: "Voir les menus",
      path: "/?tab=menus#menu",
      imgIndex: 0,
    },
    {
      title: "Composez votre Brunch",
      desc: "Viennoiseries, pains, salé, sucré, boissons... Choisissez chaque élément à la carte et créez le brunch parfait selon vos envies.",
      cta: "Explorer la carte",
      path: "/?tab=carte#menu",
      imgIndex: 1,
    },
    {
      title: "Plateaux & Planches",
      desc: "Pour un moment à plusieurs — plateaux de viennoiseries, planches de fromages ou de charcuterie. Posez au centre, profitez ensemble.",
      cta: "Découvrir",
      path: "/?tab=carte#menu",
      imgIndex: 2,
    },
    {
      title: "Événements sur mesure",
      desc: "Mariage, entreprise, anniversaire… Des formules personnalisées à partir de 8€/pers pour rendre chaque occasion inoubliable.",
      cta: "Voir les formules",
      path: "/evenements",
      imgIndex: 3,
    },
  ];

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
          {/* Gauche — Image */}
          <div className="relative rounded-3xl overflow-hidden aspect-square lg:aspect-auto min-h-96">
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
            {/* Overlay dégradé */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Droite — Options */}
          <div className="flex flex-col gap-4">
            {options.map((option, i) => (
              <div
                key={i}
                onMouseEnter={() => setActiveImg(option.imgIndex)}
                onClick={() => navigate(option.path)}
                className="group flex-1 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border-2 border-transparent hover:border-primary/20"
                style={{ backgroundColor: "white", boxShadow: "var(--card-shadow)" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
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
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA bas */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm mb-4">
            Plus de 30 produits disponibles · Livraison gratuite · 7j/7
          </p>

          <a
            href="#menu"
            onClick={() => navigate("/carte")}
            className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3 rounded-full font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Voir tous les produits →
          </a>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
