import { ClipboardList, ShoppingBag, Truck } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Choisissez",
    desc: "Parcourez notre carte et composez votre petit-déjeuner idéal parmi nos menus ou à la carte.",
  },
  {
    icon: ShoppingBag,
    title: "Commandez",
    desc: "Passez commande directement sur notre site en quelques clics ou via nos partenaires Deliveroo et Uber Eats.",
  },
  {
    icon: Truck,
    title: "Savourez",
    desc: "Livré chez vous frais et prêt à déguster.",
  },
];

const HowItWorks = () => (
  <section id="how" className="section-padding bg-card">
    <div className="max-w-6xl mx-auto text-center">
      <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Simple & rapide</p>
      <h2 className="section-title mb-4">Comment ça marche</h2>
      <p className="section-subtitle mx-auto mb-16">
        Trois étapes pour un matin parfait, sans effort.
      </p>
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <s.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
            </div>
            <div className="text-sm font-bold text-primary mb-2">0{i + 1}</div>
            <h3 className="text-xl font-display font-semibold mb-3">{s.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
