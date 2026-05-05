import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import brunchMariage from "@/assets/brunch-mariage.jpg";
import brunchEntreprise from "@/assets/brunch-entreprise.jpg";
import brunchGroupe from "@/assets/brunch-groupe.png";

const formules = [
  {
    label: "Mariage",
    tag: "Cérémonie & réception",
    price: "À partir de 12€/pers.",
    image: brunchMariage,
  },
  {
    label: "Entreprise",
    tag: "Réunion & séminaire",
    price: "À partir de 9€/pers.",
    image: brunchEntreprise,
  },
  {
    label: "Groupe",
    tag: "Anniversaire & occasions",
    price: "À partir de 8€/pers.",
    image: brunchGroupe,
  },
];

const EventsPromo = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 md:px-12 lg:px-20" style={{ backgroundColor: "#f4f1ea" }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-5"
              style={{ backgroundColor: "rgba(58,58,10,0.08)", color: "#5a5a1a" }}
            >
              <Sparkles size={11} />
              Sur mesure pour chaque occasion
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-bold leading-tight"
              style={{ color: "#2a2a08" }}
            >
              Vos événements,{" "}
              <span className="italic" style={{ color: "#7a7020" }}>
                notre signature
              </span>
            </h2>
          </div>

        </div>

        {/* Cards photos */}
        <div className="grid md:grid-cols-3 gap-5">
          {formules.map(({ label, tag, price, image }) => (
            <div
              key={label}
              className="group relative overflow-hidden rounded-2xl cursor-pointer"
              style={{ aspectRatio: "4/5" }}
              onClick={() => navigate("/evenements")}
            >
              {/* Photo */}
              <img
                src={image}
                alt={label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay dégradé */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Price tag */}
              <div
                className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ backgroundColor: "rgba(223,240,87,0.95)", color: "#3a3a0a" }}
              >
                {price}
              </div>

              {/* Text bas */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {tag}
                </p>
                <h3 className="font-display text-2xl font-bold text-white mb-3">
                  Brunch {label}
                </h3>
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ color: "#DFF057" }}
                >
                  Découvrir <ArrowRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Sous-texte */}
        <p className="text-center mt-10 text-sm" style={{ color: "#8a8a60" }}>
          Devis personnalisé · Livraison & installation incluses · Disponible 7j/7
        </p>
      </div>
    </section>
  );
};

export default EventsPromo;
