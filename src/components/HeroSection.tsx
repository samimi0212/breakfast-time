import heroImg from "@/assets/image-accueil.png";
import { Clock, MapPin, Croissant, Bike, CalendarCheck } from "lucide-react";

const badges = [
  { icon: Clock, text: "Livré en 30-45 min" },
  { icon: MapPin, text: "Alpes-Maritimes" },
  { icon: Croissant, text: "Produits frais du matin" },
  { icon: Bike, text: "7j/7 · 8h à 15h" },
  { icon: CalendarCheck, text: "Livraison le jour même" },
  { icon: Clock, text: "Livré en 30-45 min" },
  { icon: MapPin, text: "Alpes-Maritimes" },
  { icon: Croissant, text: "Produits frais du matin" },
  { icon: Bike, text: "7j/7 · 8h à 15h" },
  { icon: CalendarCheck, text: "Livraison le jour même" },
];

const HeroSection = () => (
  <section className="relative min-h-screen flex flex-col">
    {/* Image plein écran */}
    <div className="relative flex-1 flex items-center justify-center overflow-hidden">
      <img
        src={heroImg}
        alt="Petit-déjeuner luxueux livré à domicile"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />

      <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-6 animate-fade-up"
          style={{
            backgroundColor: "rgba(223, 240, 87, 0.15)",
            border: "1px solid rgba(223, 240, 87, 0.4)",
            color: "#DFF057",
            animationDelay: "0.1s",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          Livraison de petit-déjeuner & brunch
        </div>

        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6 animate-fade-up"
          style={{ animationDelay: "0.3s", color: "hsl(0 0% 100%)" }}
        >
          Rendre l'ordinaire{" "}
          <span className="italic">
            <span style={{ color: "#DFF057" }}>Extra</span>
            <span style={{ color: "#ffffff" }}>ordinaire</span>
          </span>
        </h1>

        <p
          className="text-lg md:text-xl mb-10 animate-fade-up"
          style={{ animationDelay: "0.5s", color: "hsl(0 0% 100% / 0.8)" }}
        >
          Des petits-déjeuners et brunchs, livrés chez vous en moins de 45 minutes. Alpes-Maritimes, 7j/7.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up"
          style={{ animationDelay: "0.7s" }}
        >
          <a
            href="/carte"
            className="bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Découvrir la carte
          </a>
          <a
            href="#how"
            className="border-2 px-8 py-4 rounded-full text-lg font-semibold transition-colors hover:bg-card/10"
            style={{ borderColor: "hsl(0 0% 100% / 0.3)", color: "hsl(0 0% 100%)" }}
          >
            Comment ça marche
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
        style={{ color: "hsl(0 0% 100% / 0.6)" }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </div>

    {/* Bandeau défilant */}
    <div className="relative z-20 py-3 overflow-hidden" style={{ backgroundColor: "#DFF057" }}>
      <div className="flex animate-marquee whitespace-nowrap">
        {badges.map((badge, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-1.5 mx-4 text-sm font-semibold flex-shrink-0"
            style={{ color: "#3a3a0a" }}
          >
            <badge.icon size={14} />
            <span>{badge.text}</span>
            <span className="mx-2 opacity-40">✦</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HeroSection;
