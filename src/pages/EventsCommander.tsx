import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ShoppingBag, Check, Minus, Plus } from "lucide-react";
import plateauViennoiserie from "@/assets/plateau-viennoiserie-entre.png";

const eventProducts = [
  {
    id: "evt-plateau-mini-viennoiseries",
    name: "Plateau mini viennoiseries",
    price: "29,00€",
    img: plateauViennoiserie,
    composition: ["30 mini viennoiseries", "Croissants", "Pains au chocolat"],
  },
];

const EventProductCard = ({
  product,
}: {
  product: (typeof eventProducts)[0];
}) => {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.price, img: product.img, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      className="bg-card rounded-2xl overflow-hidden flex flex-col h-full"
      style={{ boxShadow: "var(--card-shadow)" }}
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-tight">{product.name}</h3>
          <span className="text-primary font-bold text-base flex-shrink-0">{product.price}</span>
        </div>

        <ul className="space-y-1">
          {product.composition.map((item, i) => (
            <li key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-primary/40 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 mt-auto pt-2">
          <div className="flex items-center gap-2 border rounded-xl px-3 py-1.5">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="hover:text-primary transition-colors">
              <Minus size={13} />
            </button>
            <span className="w-5 text-center text-sm font-semibold">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="hover:text-primary transition-colors">
              <Plus size={13} />
            </button>
          </div>
          <button
            onClick={handleAdd}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              backgroundColor: added ? "#b8cc30" : "#DFF057",
              color: "#3a3a0a",
            }}
          >
            {added ? <Check size={14} /> : <ShoppingBag size={14} />}
            {added ? "Ajouté !" : "Ajouter au panier"}
          </button>
        </div>
      </div>
    </div>
  );
};

const EventsCommander = () => {
  const navigate = useNavigate();
  const { count } = useCart();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-foreground pt-28 pb-16 px-6 text-center">
        <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
          Livraison & installation incluses
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: "white" }}>
          Commander pour votre{" "}
          <span className="italic" style={{ color: "#DFF057" }}>
            événement
          </span>
        </h1>
        <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
          Sélectionnez vos formules et ajoutez-les au panier. Nous nous occupons du reste.
        </p>
      </div>

      {/* Breadcrumb */}
      <div className="px-6 py-4 max-w-7xl mx-auto w-full">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <button
            onClick={() => navigate("/evenements")}
            className="hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft size={13} />
            Retour aux événements
          </button>
        </p>
      </div>

      {/* Grille produits */}
      <div className="flex-1 pb-16 px-6 max-w-7xl mx-auto w-full">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {eventProducts.map((product) => (
            <EventProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Barre panier flottante si articles */}
      {count > 0 && (
        <div className="sticky bottom-0 left-0 right-0 p-4 z-40" style={{ backgroundColor: "#f4f1ea" }}>
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => navigate("/panier")}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold transition-all hover:scale-[1.01]"
              style={{ backgroundColor: "#3a3a0a", color: "white" }}
            >
              <ShoppingBag size={16} />
              Voir le panier · {count} article{count > 1 ? "s" : ""}
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default EventsCommander;
