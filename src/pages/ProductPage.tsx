import { useCart } from "@/context/CartContext";
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
  const { addItem } = useCart();
  const [selections, setSelections] = useState<Record<string, string | string[]>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelections({});
  }, [id]);

  const product = allProducts.find((p) => p.id === id);

  const allSelected = product?.options
    ? product.options.filter((o) => o.required).every((o) => {
        if (o.maxSelect) {
          const arr = (selections[o.id] as string[]) || [];
          return arr.length === o.maxSelect;
        }
        return selections[o.id] && (selections[o.id] as string[]).length > 0 || typeof selections[o.id] === "string";
      })
    : true;

  const handleSelect = (optionId: string, choice: string, multiSelect?: boolean, maxSelect?: number) => {
    if (maxSelect) {
      // Mode compteur : retrait prioritaire si déjà sélectionné, ajout si pas encore sélectionné et max non atteint
      setSelections((prev) => {
        const current = (prev[optionId] as string[]) || [];
        const total = current.length;
        const countForChoice = current.filter((c) => c === choice).length;
        if (countForChoice > 0) {
          // Déjà sélectionné → toujours retirer un exemplaire (permet la désélection complète)
          const idx = current.lastIndexOf(choice);
          const updated = [...current.slice(0, idx), ...current.slice(idx + 1)];
          return { ...prev, [optionId]: updated };
        } else if (total < maxSelect) {
          // Pas encore sélectionné et max non atteint → ajouter
          return { ...prev, [optionId]: [...current, choice] };
        }
        return prev;
      });
    } else if (multiSelect) {
      setSelections((prev) => {
        const current = (prev[optionId] as string[]) || [];
        const updated = current.includes(choice)
          ? current.filter((c) => c !== choice)
          : [...current, choice];
        return { ...prev, [optionId]: updated };
      });
    } else {
      // Toggle : reclique sur le même choix → désélectionne
      setSelections((prev) => ({
        ...prev,
        [optionId]: prev[optionId] === choice ? "" : choice,
      }));
    }
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
    if (!allSelected) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      qty,
      options: selections,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const related = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  const parsePrice = (s: string) => parseFloat(s.replace("€", "").replace(",", ".").trim()) || 0;
  const extractSupplement = (choice: string) => {
    const m = choice.match(/\(\+([0-9,]+)€\)/);
    return m ? parseFloat(m[1].replace(",", ".")) : 0;
  };
  const selectedSupplements = product.options
    ? product.options.flatMap((opt) => {
        const sel = selections[opt.id];
        if (!sel) return [];
        const arr = Array.isArray(sel) ? sel : typeof sel === "string" && sel ? [sel] : [];
        const withPrice = arr.filter((c) => extractSupplement(c) > 0);
        // firstFree : les N premiers toppings avec prix sont offerts
        if (opt.firstFree && withPrice.length > 0) {
          return withPrice.slice(opt.firstFree);
        }
        return withPrice;
      })
    : [];
  const supplementsTotal = selectedSupplements.reduce((acc, c) => acc + extractSupplement(c), 0);
  const totalPrice = parsePrice(product.price) + supplementsTotal;
  const totalWithQty = totalPrice * qty;
  const fmt = (n: number) => n.toFixed(2).replace(".", ",") + "€";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── MOBILE ─────────────────────────────────────────────── */}
      <div className="md:hidden" style={{ paddingTop: "80px" }}>
        {/* Image pleine largeur */}
        <div className="relative w-full" style={{ height: "42vh" }}>
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {/* Bouton retour flottant */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-3 left-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md"
          >
            <ArrowLeft size={18} className="text-foreground" />
          </button>
          {/* Badge catégorie */}
          <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Carte blanche qui chevauche l'image */}
        <div
          className="relative bg-background rounded-t-3xl -mt-5 pb-32 px-5 pt-6"
          style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.08)" }}
        >
          {/* Titre + prix */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1">
              <p className="text-primary text-xs font-semibold tracking-widest uppercase mb-1">{product.category}</p>
              <h1 className="font-display text-2xl font-bold leading-tight">{product.name}</h1>
            </div>
            <span className="text-2xl font-display font-bold text-primary flex-shrink-0 mt-5">{product.price}</span>
          </div>

          {/* Description */}
          {product.desc && (
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">{product.desc}</p>
          )}

          {/* Composition */}
          {product.composition.length > 0 && (
            <div className="bg-muted rounded-2xl p-4 mb-4">
              <h3 className="font-display font-semibold text-sm mb-2">Détails</h3>
              <ul className="space-y-1.5">
                {product.composition.map((item, i) => {
                  const hasChoice = item.includes("au choix");
                  const cleanItem = item.replace(" au choix", "");
                  return (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                      <span className="w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                        <Check size={10} className="text-primary" />
                      </span>
                      <span>{cleanItem}</span>
                      {hasChoice && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#DFF057", color: "#5a5a1a" }}>
                          au choix
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Allergènes */}
          {product.allergens && product.allergens.length > 0 && (
            <div className="bg-muted rounded-2xl p-4 mb-4">
              <h3 className="font-display font-semibold text-sm mb-2">Allergènes</h3>
              <div className="flex flex-wrap gap-2">
                {product.allergens.map((item, i) => {
                  const icons: Record<string, string> = {
                    "Gluten": "🌾", "Œufs": "🥚", "Poisson": "🐟", "Crustacés": "🦀",
                    "Arachide": "🥜", "Soja": "🫘", "Céleri": "🥬", "Lait": "🥛",
                    "Fruits à coque": "🌰", "Moutarde": "🟡", "Sésame": "🌱",
                    "Sulfites": "🧪", "Lupin": "🌻", "Mollusques": "🦪",
                  };
                  return (
                    <span key={i} className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-medium">
                      {icons[item] ?? "⚠️"} {item}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Options */}
          {product.options && product.options.length > 0 && (
            <div className="space-y-3 mb-4">
              {product.options.map((option) => {
                if (option.type === "text") {
                  const val = (selections[option.id] as string) || "";
                  return (
                    <div key={option.id}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-display font-semibold text-sm">{option.label}</h3>
                        <span className="text-xs text-muted-foreground">{val.length}/50</span>
                      </div>
                      <textarea
                        rows={3}
                        maxLength={50}
                        placeholder={option.placeholder}
                        value={val}
                        onChange={(e) => setSelections((prev) => ({ ...prev, [option.id]: e.target.value }))}
                        className="w-full rounded-xl border-2 border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
                      />
                    </div>
                  );
                }
                return (
                  <div key={option.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-display font-semibold text-sm">{option.label}</h3>
                      {option.required && (
                        <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                          Choix requis
                        </span>
                      )}
                    </div>
                    {option.maxSelect && (
                      <p className="text-xs text-muted-foreground mb-2">
                        {((selections[option.id] as string[]) || []).length} / {option.maxSelect} sélectionné(s)
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {option.choices.map((choice) => {
                        const arr = (selections[option.id] as string[]) || [];
                        const count = option.maxSelect ? arr.filter((c) => c === choice).length : 0;
                        const isSelected = option.maxSelect
                          ? count > 0
                          : option.multiSelect
                          ? arr.includes(choice)
                          : selections[option.id] === choice;
                        const totalReached = option.maxSelect ? arr.length >= option.maxSelect : false;
                        const cleanChoice = choice.replace(/\s*\(\+[0-9,]+€\)/, "");
                        const selArr = Array.isArray(selections[option.id]) ? (selections[option.id] as string[]) : [];
                        const withPriceArr = option.firstFree ? selArr.filter((c) => extractSupplement(c) > 0) : [];
                        const paidItems = option.firstFree ? withPriceArr.slice(option.firstFree) : [];
                        const supplement = extractSupplement(choice);
                        const isPaid = option.firstFree ? isSelected && paidItems.includes(choice) : isSelected && supplement > 0;
                        return (
                          <button
                            key={choice}
                            onClick={() => handleSelect(option.id, choice, option.multiSelect, option.maxSelect)}
                            disabled={totalReached && count === 0}
                            className={`relative px-3 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                              isSelected
                                ? "bg-primary text-primary-foreground border-primary"
                                : totalReached && count === 0
                                ? "bg-white border-border text-muted-foreground opacity-40 cursor-not-allowed"
                                : "bg-white border-border text-foreground hover:border-primary"
                            }`}
                          >
                            {cleanChoice}
                            {count >= 1 && !option.firstFree && (
                              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
                                style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}>
                                ×{count}
                              </span>
                            )}
                            {supplement > 0 && (
                              <span className="absolute -top-2 -right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none"
                                style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}>
                                +{supplement.toFixed(2).replace(".", ",")}€
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Livraison */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border rounded-xl px-3 py-2.5">
            <span>🚴</span>
            <span>Livré en <strong className="text-foreground">30-45 min</strong> · Suivi en temps réel</span>
          </div>
        </div>

        {/* Barre sticky bas */}
        <div className="fixed bottom-14 left-0 right-0 z-40 bg-white border-t border-border px-4 pt-2 pb-3 flex flex-col gap-2">
          {/* Détail prix */}
          {selectedSupplements.length > 0 && (
            <div className="flex items-center gap-1 text-xs flex-wrap">
              <span className="text-muted-foreground">{product.price}</span>
              {selectedSupplements.map((s, i) => (
                <span key={i} className="text-muted-foreground">+ {s}</span>
              ))}
              <span className="text-muted-foreground">=</span>
              <span className="font-bold text-foreground">{fmt(totalWithQty)}</span>
            </div>
          )}
          {/* Quantité + bouton */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-muted rounded-xl px-2 py-1.5 flex-shrink-0">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-7 h-7 rounded-lg bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <Minus size={13} />
              </button>
              <span className="font-semibold w-6 text-center">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-7 h-7 rounded-lg bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <Plus size={13} />
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={!allSelected}
              className="flex-1 py-3 rounded-2xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={added ? { backgroundColor: "#DFF057", color: "#3a3a0a" } : { backgroundColor: "hsl(61,45%,42%)", color: "white" }}
            >
              {added ? (
                <><Check size={16} /> Ajouté !</>
              ) : (
                <><ShoppingBag size={16} /> Ajouter au panier · {fmt(totalWithQty)}</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── DESKTOP ────────────────────────────────────────────── */}
      <div className="hidden md:block pt-24 pb-16 px-6 max-w-6xl mx-auto">
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
            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
              {product.category}
            </span>
          </div>

          {/* Infos */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">{product.category}</p>
              <h1 className="font-display text-4xl lg:text-5xl font-bold leading-tight mb-4">{product.name}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">{product.desc}</p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-bold text-primary">{product.price}</span>
            </div>

            {product.composition.length > 0 && (
              <div className="bg-muted rounded-2xl p-5">
                <h3 className="font-display font-semibold text-lg mb-3">Détails</h3>
                <ul className="space-y-2">
                  {product.composition.map((item, i) => {
                    const hasChoice = item.includes("au choix");
                    const cleanItem = item.replace(" au choix", "");
                    return (
                      <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                        <span className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                          <Check size={12} className="text-primary" />
                        </span>
                        <span>{cleanItem}</span>
                        {hasChoice && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#DFF057", color: "#5a5a1a" }}>
                            au choix
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {product.allergens && product.allergens.length > 0 && (
              <div className="bg-muted rounded-2xl p-5">
                <h3 className="font-display font-semibold text-lg mb-3">Allergènes</h3>
                <ul className="space-y-2">
                  {product.allergens.map((item, i) => {
                    const icons: Record<string, string> = {
                      "Gluten": "🌾", "Œufs": "🥚", "Poisson": "🐟", "Crustacés": "🦀",
                      "Arachide": "🥜", "Soja": "🫘", "Céleri": "🥬", "Lait": "🥛",
                      "Fruits à coque": "🌰", "Moutarde": "🟡", "Sésame": "🌱",
                      "Sulfites": "🧪", "Lupin": "🌻", "Mollusques": "🦪",
                    };
                    return (
                      <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                        <span className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 text-base">
                          {icons[item] ?? "⚠️"}
                        </span>
                        <span>{item}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {product.options && product.options.length > 0 && (
              <div className="space-y-4">
                {product.options.map((option) => {
                  if (option.type === "text") {
                    const val = (selections[option.id] as string) || "";
                    return (
                      <div key={option.id}>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-display font-semibold text-lg">{option.label}</h3>
                          <span className="text-xs text-muted-foreground">{val.length}/50</span>
                        </div>
                        <textarea
                          rows={3}
                          maxLength={50}
                          placeholder={option.placeholder}
                          value={val}
                          onChange={(e) => setSelections((prev) => ({ ...prev, [option.id]: e.target.value }))}
                          className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
                        />
                      </div>
                    );
                  }
                  return (
                    <div key={option.id}>
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="font-display font-semibold text-lg">{option.label}</h3>
                        {option.required && (
                          <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">Choix requis</span>
                        )}
                      </div>
                      {option.maxSelect && (
                        <p className="text-xs text-muted-foreground mb-2">
                          {((selections[option.id] as string[]) || []).length} / {option.maxSelect} sélectionné(s)
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {option.choices.map((choice) => {
                          const arr = (selections[option.id] as string[]) || [];
                          const count = option.maxSelect ? arr.filter((c) => c === choice).length : 0;
                          const isSelected = option.maxSelect ? count > 0 : option.multiSelect ? arr.includes(choice) : selections[option.id] === choice;
                          const totalReached = option.maxSelect ? arr.length >= option.maxSelect : false;
                          const cleanChoice = choice.replace(/\s*\(\+[0-9,]+€\)/, "");
                          const selArr = Array.isArray(selections[option.id]) ? (selections[option.id] as string[]) : [];
                          const withPriceArr = option.firstFree ? selArr.filter((c) => extractSupplement(c) > 0) : [];
                          const paidItems = option.firstFree ? withPriceArr.slice(option.firstFree) : [];
                          const supplement = extractSupplement(choice);
                          const isPaid = option.firstFree ? isSelected && paidItems.includes(choice) : isSelected && supplement > 0;
                          return (
                            <button key={choice}
                              onClick={() => handleSelect(option.id, choice, option.multiSelect, option.maxSelect)}
                              disabled={totalReached && count === 0}
                              className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                                isSelected ? "bg-primary text-primary-foreground border-primary"
                                : totalReached && count === 0 ? "bg-white border-border text-muted-foreground opacity-40 cursor-not-allowed"
                                : "bg-white border-border text-foreground hover:border-primary hover:text-primary"
                              }`}
                            >
                              {cleanChoice}
                              {count >= 1 && !option.firstFree && (
                                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
                                  style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}>×{count}</span>
                              )}
                              {supplement > 0 && (
                                <span className="absolute -top-2 -right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none"
                                  style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}>
                                  +{supplement.toFixed(2).replace(".", ",")}€
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex flex-col gap-3">
              {selectedSupplements.length > 0 && (
                <div className="flex items-center gap-1.5 text-sm flex-wrap">
                  <span className="text-muted-foreground">{product.price}</span>
                  {selectedSupplements.map((s, i) => (
                    <span key={i} className="text-muted-foreground">+ {s}</span>
                  ))}
                  <span className="text-muted-foreground">=</span>
                  <span className="font-bold text-foreground text-base">{fmt(totalWithQty)}</span>
                </div>
              )}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2.5 flex-shrink-0">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-semibold w-8 text-center text-lg">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={handleAdd}
                  disabled={!allSelected}
                  className="flex-1 py-4 rounded-2xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={added ? { backgroundColor: "#DFF057", color: "#3a3a0a" } : { backgroundColor: "hsl(61,45%,42%)", color: "white" }}
                >
                  {added ? (
                    <><Check size={20} /> Ajouté au panier !</>
                  ) : (
                    <><ShoppingBag size={20} /> Ajouter au panier · {fmt(totalWithQty)}</>
                  )}
                </button>
              </div>
              {!allSelected && (
                <p className="text-sm text-amber-600 font-medium">
                  Veuillez sélectionner toutes les options obligatoires
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground border border-border rounded-2xl px-4 py-3">
              <span className="text-xl">🚴</span>
              <span>Livré en <strong className="text-foreground">30-45 minutes</strong> · Suivi de livraison en temps réel</span>
            </div>
          </div>
        </div>

        {/* Produits similaires */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-2xl font-semibold mb-8">Vous aimerez aussi</h2>
            <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/produit/${item.id}`)}
                  className="bg-card rounded-2xl overflow-hidden cursor-pointer hover-lift group"
                  style={{ boxShadow: "var(--card-shadow)" }}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3 flex justify-between items-center">
                    <h3 className="font-display font-semibold text-sm">{item.name}</h3>
                    <span className="text-primary font-bold text-sm">{item.price}</span>
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
