import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShoppingBag, Check, Minus, Plus, ArrowLeft } from "lucide-react";

const eventProducts = [
  {
    id: "evt-plateau-decouverte",
    name: "Plateau Découverte Événement",
    price: "24,90€",
    img: "/menu-francais.png",
    desc: "Un plateau généreux pensé pour vos événements : viennoiseries premium, charcuterie fine, fromages sélectionnés et jus de fruits frais. Idéal pour 2 personnes.",
    composition: [
      "2 croissants pur beurre",
      "2 pains au chocolat",
      "Sélection charcuterie (jambon, saucisson)",
      "Fromages affinés (3 variétés)",
      "2 jus de fruits frais au choix",
      "Confiture artisanale",
    ],
  },
];

const EventsCommander = () => {
  const navigate = useNavigate();
  const { addItem, count } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const product = eventProducts[0];

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Retour */}
          <button
            onClick={() => navigate("/evenements")}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft size={16} />
            Retour aux événements
          </button>

          {/* Header */}
          <div className="mb-12">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ backgroundColor: "rgba(58,58,10,0.08)", color: "#5a5a1a" }}
            >
              <ShoppingBag size={11} />
              Commander pour votre événement
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight" style={{ color: "#2a2a08" }}>
              Nos formules{" "}
              <span className="italic" style={{ color: "#7a7020" }}>
                événements
              </span>
            </h1>
            <p className="mt-4 text-base text-muted-foreground max-w-xl">
              Commandez directement en ligne pour votre mariage, séminaire ou occasion spéciale. Livraison & installation incluses.
            </p>
          </div>

          {/* Produit */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Image */}
            <div
              className="rounded-3xl overflow-hidden aspect-square"
              style={{ boxShadow: "0 20px 50px -10px rgba(0,0,0,0.12)" }}
            >
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Détails */}
            <div className="py-4">
              <h2 className="font-display text-3xl font-bold mb-3">{product.name}</h2>
              <p className="text-2xl font-bold mb-6" style={{ color: "#7a7020" }}>
                {product.price}
                <span className="text-base font-normal text-muted-foreground ml-2">/ plateau (2 pers.)</span>
              </p>

              <p className="text-muted-foreground leading-relaxed mb-8">{product.desc}</p>

              {/* Composition */}
              <div className="mb-10">
                <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#5a5a1a" }}>
                  Composition
                </p>
                <ul className="space-y-2">
                  {product.composition.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "rgba(223,240,87,0.4)" }}
                      >
                        <Check size={11} style={{ color: "#3a3a0a" }} />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantité */}
              <div className="flex items-center gap-4 mb-6">
                <p className="text-sm font-medium">Quantité</p>
                <div className="flex items-center gap-3 border rounded-full px-4 py-2">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="hover:text-primary transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center font-semibold text-sm">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="hover:text-primary transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAdd}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
                  style={{ backgroundColor: added ? "#b8cc30" : "#DFF057", color: "#3a3a0a" }}
                >
                  {added ? <Check size={16} /> : <ShoppingBag size={16} />}
                  {added ? "Ajouté au panier !" : "Ajouter au panier"}
                </button>
                <button
                  onClick={() => {
                    handleAdd();
                    setTimeout(() => navigate("/panier"), 300);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
                  style={{ backgroundColor: "#3a3a0a", color: "#ffffff" }}
                >
                  Commander maintenant
                </button>
              </div>

              {count > 0 && (
                <button
                  onClick={() => navigate("/panier")}
                  className="mt-4 w-full text-center text-sm font-medium underline underline-offset-4"
                  style={{ color: "#7a7020" }}
                >
                  Voir le panier ({count} article{count > 1 ? "s" : ""})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EventsCommander;
