import { Leaf, MapPin, Clock, Award } from "lucide-react";

const benefits = [
  { icon: Leaf, title: "Produits frais", desc: "Préparés le matin même avec des ingrédients soigneusement sélectionnés." },
  { icon: MapPin, title: "Produits locaux", desc: "Nous privilégions les producteurs et artisans des Alpes-Maritimes." },
  { icon: Clock, title: "Livraison rapide", desc: "Livré en moins de 45 min, 7 jours sur 7, de 8h à 15h." },
  { icon: Award, title: "Expérience soignée", desc: "Une présentation soignée et prête à déguster." },
];

const WhyChooseUs = () => (
  <section className="section-padding bg-foreground" style={{ color: "hsl(var(--background))" }}>
    <div className="max-w-6xl mx-auto text-center">
      <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Nos engagements</p>
      <h2 className="section-title mb-4" style={{ color: "hsl(var(--background))" }}>Pourquoi Breakfast Time ?</h2>
      <p className="section-subtitle mx-auto mb-16" style={{ color: "hsl(var(--background) / 0.6)" }}>
        Bien plus qu'une livraison : une expérience matinale pensée pour vous.
      </p>
      {/* Desktop : grille 4 colonnes centrée */}
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

      {/* Mobile : liste horizontale icône + texte */}
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

export default WhyChooseUs;
