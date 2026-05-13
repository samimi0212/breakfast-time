import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
  { name: "Marie L.", text: "Les croissants sont incroyablement frais, on sent vraiment la différence. Livraison à l'heure, rien à redire.", rating: 5 },
  { name: "Thomas D.", text: "J'ai offert une box pour l'anniversaire de ma compagne, elle était ravie. Présentation soignée et produits délicieux.", rating: 5 },
  { name: "Sophie M.", text: "On commande chaque vendredi pour l'équipe. Simple, fiable, et tout le monde se régale à chaque fois.", rating: 5 },
  { name: "Julie R.", text: "Le pain au chocolat était encore chaud à la livraison. Je ne savais pas que c'était possible, maintenant je commande tous les week-ends.", rating: 5 },
  { name: "Alexandre B.", text: "Commande passée la veille au soir, livrée pile à l'heure le lendemain matin. Parfait pour bien démarrer la journée.", rating: 5 },
  { name: "Camille F.", text: "Les jus de fruits sont frais pressés, c'est vraiment ce qui fait la différence. On ne peut plus s'en passer.", rating: 5 },
  { name: "Nicolas P.", text: "On a organisé un brunch pour 10 personnes, tout était parfait. Présentation impeccable et rien ne manquait.", rating: 5 },
  { name: "Laura M.", text: "Le service client est très réactif. Un souci de livraison un matin, réglé en 10 minutes. Vraiment sérieux.", rating: 5 },
  { name: "Romain G.", text: "Ça fait 3 mois qu'on commande régulièrement. La qualité est constante et les produits sont toujours frais.", rating: 5 },
];

const VISIBLE = 4;

const Testimonials = () => {
  const [start, setStart] = useState(0);

  const prev = () => setStart((s) => Math.max(0, s - 1));
  const next = () => setStart((s) => Math.min(reviews.length - VISIBLE, s + 1));

  const visible = reviews.slice(start, start + VISIBLE);

  return (
    <section className="section-padding bg-card">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Témoignages</p>
        <h2 className="section-title mb-4">Ce que disent nos clients</h2>
        <p className="section-subtitle mx-auto mb-12">
          Des matins plus beaux grâce à Breakfast Time.
        </p>

        <div className="flex items-center gap-4">
          <button
            onClick={prev}
            disabled={start === 0}
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border border-border bg-background hover:bg-primary hover:text-white hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
            {visible.map((r, i) => (
              <div
                key={start + i}
                className="bg-background rounded-xl p-5 text-left"
                style={{ boxShadow: "var(--card-shadow)" }}
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground text-sm leading-relaxed mb-4">"{r.text}"</p>
                <p className="font-display font-semibold text-foreground text-sm">{r.name}</p>
              </div>
            ))}
          </div>

          <button
            onClick={next}
            disabled={start >= reviews.length - VISIBLE}
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border border-border bg-background hover:bg-primary hover:text-white hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: reviews.length - VISIBLE + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setStart(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === start ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
