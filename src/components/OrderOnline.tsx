import heroImg from "@/assets/hero-breakfast.jpg";

const OrderOnline = () => (
  <section className="relative py-28 overflow-hidden">
    {/* Photo de fond */}
    <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
    <div
      className="absolute inset-0"
      style={{ background: "linear-gradient(135deg, hsla(61, 45%, 12%, 0.88) 0%, hsla(30, 10%, 8%, 0.80) 100%)" }}
    />

    {/* Contenu */}
    <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
      {/* Badge */}
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-8"
        style={{
          backgroundColor: "rgba(223, 240, 87, 0.12)",
          border: "1px solid rgba(223, 240, 87, 0.35)",
          color: "#DFF057",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
        Livraison à domicile · 7j/7
      </div>

      {/* Titre */}
      <h2
        className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight"
        style={{ color: "white" }}
      >
        Commandez, livré{" "}
        <span className="italic" style={{ color: "#DFF057" }}>
          aujourd'hui
        </span>
      </h2>

      <p className="text-base mb-10 leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
        Suivi de livraison en temps réel.
      </p>

      {/* Bouton */}
      <div className="flex justify-center">
        <a
          href="/carte"
          className="inline-flex items-center justify-center px-10 py-4 rounded-full text-base font-bold transition-all hover:scale-105"
          style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
        >
          Commander maintenant
        </a>
      </div>
    </div>
  </section>
);

export default OrderOnline;
