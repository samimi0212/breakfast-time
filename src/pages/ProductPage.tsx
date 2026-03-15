import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, ShoppingBag, Check, Minus, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import { allProducts } from "@/data/products";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [selections, setSelections] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelections({});
  }, [id]);

  const product = allProducts.find((p) => p.id === id);

  const allSelected = product?.options
    ? product.options.filter((o) => o.required).every((o) => selections[o.id])
    : true;

  const handleSelect = (optionId: string, choice: string) => {
    setSelections((prev) => ({ ...prev, [optionId]: choice }));
  };


  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-display mb-4">Produit introuvable</p>
          <button onClick={() => navigate("/#menu")} className="text-primary underline">
            Retour à la carte
          </button>
        </div>
      </div>
    );
  }

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const related = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 px-6 max-w-6xl mx-auto">
        {/* Retour */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Retour</span>
        </button>

        {/* Produit principal */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-muted">
              <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {/* Badge catégorie */}
            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
              {product.category}
            </span>
          </div>

          {/* Infos */}
          <div className="flex flex-col gap-6">
            {/* Titre + prix */}
            <div>
              <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">{product.category}</p>
              <h1 className="font-display text-4xl lg:text-5xl font-bold leading-tight mb-4">{product.name}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">{product.desc}</p>
            </div>

            {/* Prix */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-bold text-primary">{product.price}</span>
              <span className="text-muted-foreground text-sm">/ personne</span>
            </div>

            {/* Composition */}
            {product.composition.length > 0 && (
              <div className="bg-muted rounded-2xl p-5">
                <h3 className="font-display font-semibold text-lg mb-3">Composition</h3>
                <ul className="space-y-2">
                  {product.composition.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                      <span className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-primary" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Options */}
            {product.options && product.options.length > 0 && (
              <div className="space-y-5">
                {product.options.map((option) => (
                  <div key={option.id}>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="font-display font-semibold text-lg">{option.label}</h3>
                      {option.required && (
                        <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                          Obligatoire
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {option.choices.map((choice) => (
                        <button
                          key={choice}
                          onClick={() => handleSelect(option.id, choice)}
                          className={`px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                            selections[option.id] === choice
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-white border-border text-foreground hover:border-primary hover:text-primary"
                          }`}
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantité + Ajouter */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Quantité */}
              <div className="flex items-center gap-3 bg-muted rounded-2xl px-4 py-3">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="font-semibold text-lg w-8 text-center">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Bouton ajouter */}
              <button
                onClick={handleAdd}
                disabled={!allSelected}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                  added
                    ? "bg-green-500 text-white"
                    : allSelected
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {added ? (
                  <>
                    <Check size={20} />
                    Ajouté !
                  </>
                ) : !allSelected ? (
                  <>
                    <ShoppingBag size={20} />
                    Veuillez compléter vos choix
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    Ajouter au panier —{" "}
                    {(parseFloat(product.price.replace("€", "").replace(",", ".")) * qty).toFixed(2).replace(".", ",")}€
                  </>
                )}
              </button>
            </div>

            {/* Livraison */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground border border-border rounded-2xl px-4 py-3">
              <span className="text-xl">🚴</span>
              <span>
                Livré en <strong className="text-foreground">30 minutes</strong> · Alpes-Maritimes · 7j/7 de 7h à 15h
              </span>
            </div>
          </div>
        </div>

        {/* Produits similaires */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-2xl font-semibold mb-8">Vous aimerez aussi</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/produit/${item.id}`)}
                  className="bg-card rounded-2xl overflow-hidden cursor-pointer hover-lift group"
                  style={{ boxShadow: "var(--card-shadow)" }}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <h3 className="font-display font-semibold">{item.name}</h3>
                    <span className="text-primary font-bold">{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
