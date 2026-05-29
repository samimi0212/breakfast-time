import { Clock, Star } from "lucide-react";
import heroImg from "@/assets/hero-breakfast.jpg";

const FinalCTA = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Image de fond */}
      <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, hsla(61, 45%, 20%, 0.92) 0%, hsla(30, 10%, 8%, 0.85) 100%)" }}
      />

      {/* Contenu */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-8"
          style={{
            backgroundColor: "rgba(223, 240, 87, 0.15)",
            border: "1px solid rgba(223, 240, 87, 0.4)",
            color: "#DFF057",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          Livraison 7j/7 · Alpes-Maritimes
        </div>

        {/* Titre */}
        <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight" style={{ color: "white" }}>
          Votre matin mérite{" "}
          <span className="italic" style={{ color: "#DFF057" }}>
            mieux
          </span>
        </h2>

        <p
          className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          Petit-déjeuner ou brunch, livré en 30 à 45 minutes avec des produits frais préparés le matin même. Commandez dès
          maintenant.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {[
            { icon: Clock, value: "30 min", label: "Délai de livraison" },
            { icon: Star, value: "100%", label: "Produits frais" },
            { icon: Star, value: "7j/7", label: "7h à 15h" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <stat.icon size={16} style={{ color: "#DFF057" }} />
                <span className="text-2xl font-display font-bold" style={{ color: "white" }}>
                  {stat.value}
                </span>
              </div>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Boutons plateformes */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            disabled
            className="flex items-center justify-center gap-2 px-10 py-4 rounded-full text-lg font-semibold opacity-80 cursor-not-allowed"
            style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
          >
            Uber Eats
          </button>
          <button
            disabled
            className="px-10 py-4 rounded-full text-lg font-semibold border-2 opacity-80 cursor-not-allowed"
            style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}
          >
            Deliveroo
          </button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
