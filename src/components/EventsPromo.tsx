import { useNavigate } from "react-router-dom";
import { Heart, Briefcase, Users, Gift } from "lucide-react";

const events = [
  { icon: Heart, label: "Mariage" },
  { icon: Users, label: "Brunch groupe" },
  { icon: Briefcase, label: "Entreprise" },
  { icon: Gift, label: "Box cadeau" },
];

const EventsPromo = () => {
  const navigate = useNavigate();

  return (
    <section className="section-padding bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-3xl overflow-hidden grid md:grid-cols-2" style={{ background: "hsl(var(--foreground))" }}>

          {/* Colonne gauche — texte */}
          <div className="p-10 md:p-14 flex flex-col justify-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-6 w-fit"
              style={{
                backgroundColor: "rgba(223, 240, 87, 0.15)",
                border: "1px solid rgba(223, 240, 87, 0.4)",
                color: "#DFF057",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              Nouveau
            </div>

            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-4" style={{ color: "white" }}>
              Votre événement,{" "}
              <span className="italic" style={{ color: "#DFF057" }}>
                sur mesure
              </span>
            </h2>

            <p className="text-base leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.65)" }}>
              Mariage, brunch d'entreprise, anniversaire… Nous concevons des formules personnalisées pour rendre chaque occasion inoubliable. Commandez directement en ligne.
            </p>

            <button
              onClick={() => navigate("/carte?tab=evenements")}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm transition-all hover:scale-105 w-fit"
              style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
            >
              Voir les formules événements →
            </button>
          </div>

          {/* Colonne droite — cartes événements */}
          <div className="p-10 md:p-14 grid grid-cols-2 gap-4 content-center">
            {events.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl text-center cursor-pointer hover:scale-105 transition-transform duration-200"
                style={{ backgroundColor: "rgba(223, 240, 87, 0.08)", border: "1px solid rgba(223, 240, 87, 0.15)" }}
                onClick={() => navigate("/carte?tab=evenements")}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(223, 240, 87, 0.15)" }}
                >
                  <Icon size={22} style={{ color: "#DFF057" }} />
                </div>
                <span className="text-sm font-semibold" style={{ color: "white" }}>{label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default EventsPromo;
