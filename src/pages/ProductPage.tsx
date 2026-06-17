import { useCart } from "@/context/CartContext";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ShoppingBag, Check, Minus, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useLangPath } from "@/hooks/useLangPath";
import { allProducts } from "@/data/products";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { lp } = useLangPath();
  const isEn = i18n.language === "en";
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const [selections, setSelections] = useState<Record<string, string | string[]>>({});
  // Mémorise le dernier choix retiré pour continuer la désélection même sous le max
  const lastRemovedRef = useRef<{ optionId: string; choice: string } | null>(null);

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
      const current = (selections[optionId] as string[]) || [];
      const total = current.length;
      const countForChoice = current.filter((c) => c === choice).length;
      const justRemovedThis =
        lastRemovedRef.current?.optionId === optionId &&
        lastRemovedRef.current?.choice === choice;

      if (countForChoice > 0 && (total >= maxSelect || justRemovedThis)) {
        // Retirer un exemplaire (au max OU on vient d'en retirer un → on continue)
        lastRemovedRef.current = { optionId, choice };
        const idx = current.lastIndexOf(choice);
        const updated = [...current.slice(0, idx), ...current.slice(idx + 1)];
        setSelections((prev) => ({ ...prev, [optionId]: updated }));
      } else if (total < maxSelect && (countForChoice === 0 || !justRemovedThis)) {
        // Ajouter un exemplaire (countForChoice===0 : item entièrement désélectionné → toujours autoriser)
        lastRemovedRef.current = null;
        setSelections((prev) => ({ ...prev, [optionId]: [...current, choice] }));
      }
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
          <p className="text-2xl font-display mb-4">{t("productPage.notFound")}</p>
          <button onClick={() => navigate(lp("/") + "#menu")} className="text-primary underline">
            {t("productPage.backToMenu")}
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

  const localName = isEn ? (product.name_en || product.name) : product.name;
  const localComposition = isEn ? (product.composition_en || product.composition) : product.composition;
  const localAllergens = isEn && product.allergens_en ? product.allergens_en : product.allergens;

  const parsePrice = (s: string) => parseFloat(s.replace("€", "").replace(",", ".").trim()) || 0;
  const extractSupplement = (choice: string) => {
    const m = choice.match(/\(\+([0-9,]+)€\)/) || choice.match(/\(\+€([0-9.]+)\)/);
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
              <h1 className="font-display text-2xl font-bold leading-tight">{localName}</h1>
            </div>
            <span className="text-2xl font-display font-bold text-primary flex-shrink-0 mt-5">{product.price}</span>
          </div>

          {/* Description */}
          {product.desc && (
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">{product.desc}</p>
          )}

          {/* Composition */}
          {localComposition.length > 0 && (
            <div className="bg-muted rounded-2xl p-4 mb-4">
              <h3 className="font-display font-semibold text-sm mb-2">{t("productPage.details")}</h3>
              <ul className="space-y-1.5">
                {localComposition.map((item, i) => {
                  const hasChoice = item.includes("au choix") || item.includes("of your choice");
                  const cleanItem = item.replace(" au choix", "").replace(" of your choice", "");
                  return (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                      <span className="w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                        <Check size={10} className="text-primary" />
                      </span>
                      <span>{cleanItem}</span>
                      {hasChoice && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#DFF057", color: "#5a5a1a" }}>
                          {t("productPage.choiceLabel")}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Allergènes */}
          {localAllergens && localAllergens.length > 0 && (
            <div className="bg-muted rounded-2xl p-4 mb-4">
              <h3 className="font-display font-semibold text-sm mb-2">{t("productPage.allergens")}</h3>
              <div className="flex flex-wrap gap-2">
                {localAllergens.map((item, i) => {
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
                        <h3 className="font-display font-semibold text-sm">{(isEn && option.label_en) ? option.label_en : option.label}</h3>
                        <span className="text-xs text-muted-foreground">{val.length}/50</span>
                      </div>
                      <textarea
                        rows={3}
                        maxLength={50}
                        placeholder={(isEn && option.placeholder_en) ? option.placeholder_en : option.placeholder}
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
                      <h3 className="font-display font-semibold text-sm">{(isEn && option.label_en) ? option.label_en : option.label}</h3>
                      {option.required && (
                        <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                          {t("productPage.requiredChoice")}
                        </span>
                      )}
                    </div>
                    {option.maxSelect && (
                      <p className="text-xs text-muted-foreground mb-2">
                        {((selections[option.id] as string[]) || []).length} / {option.maxSelect} sélectionné(s)
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {(isEn && option.choices_en ? option.choices_en : option.choices).map((choice) => {
                        const arr = (selections[option.id] as string[]) || [];
                        const count = option.maxSelect ? arr.filter((c) => c === choice).length : 0;
                        const isSelected = option.maxSelect
                          ? count > 0
                          : option.multiSelect
                          ? arr.includes(choice)
                          : selections[option.id] === choice;
                        const totalReached = option.maxSelect ? arr.length >= option.maxSelect : false;
                        const cleanChoice = choice.replace(/\s*\(\+[0-9,]+€\)/, "").replace(/\s*\(\+€[0-9.]+\)/, "");
                        const selArr = Array.isArray(selections[option.id]) ? (selections[option.id] as string[]) : [];
                        const withPriceArr = option.firstFree ? selArr.filter((c) => extractSupplement(c) > 0) : [];
                        const paidItems = option.firstFree ? withPriceArr.slice(option.firstFree) : [];
                        const supplement = extractSupplement(choice);
                        const isPaid = option.firstFree ? isSelected && paidItems.includes(choice) : isSelected && supplement > 0;
                        const showPriceBadge = supplement > 0 && (isSelected ? isPaid : (!option.firstFree || withPriceArr.length >= option.firstFree));
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
                            {showPriceBadge && (
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
            <span>{t("productPage.deliveryShort")}</span>
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
                <><Check size={16} /> {t("productPage.addedShort")}</>
              ) : (
                <><ShoppingBag size={16} /> {t("productPage.addToCartShort", { price: fmt(totalWithQty) })}</>
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
          <span className="text-sm font-medium">{t("productPage.back")}</span>
        </button>

        {/* Produit principal */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-muted">
              <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Infos */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">{product.category}</p>
              <h1 className="font-display text-4xl lg:text-5xl font-bold leading-tight mb-4">{localName}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">{product.desc}</p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-bold text-primary">{product.price}</span>
            </div>

            {localComposition.length > 0 && (
              <div className="bg-muted rounded-2xl p-5">
                <h3 className="font-display font-semibold text-lg mb-3">{t("productPage.details")}</h3>
                <ul className="space-y-2">
                  {localComposition.map((item, i) => {
                    const hasChoice = item.includes("au choix") || item.includes("of your choice");
                    const cleanItem = item.replace(" au choix", "").replace(" of your choice", "").replace(" to choose", "");
                    return (
                      <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                        <span className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                          <Check size={12} className="text-primary" />
                        </span>
                        <span>{cleanItem}</span>
                        {hasChoice && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#DFF057", color: "#5a5a1a" }}>
                            {t("productPage.choiceLabel")}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {localAllergens && localAllergens.length > 0 && (
              <div className="bg-muted rounded-2xl p-5">
                <h3 className="font-display font-semibold text-lg mb-3">{t("productPage.allergens")}</h3>
                <ul className="space-y-2">
                  {localAllergens.map((item, i) => {
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
                          <h3 className="font-display font-semibold text-lg">{(isEn && option.label_en) ? option.label_en : option.label}</h3>
                          <span className="text-xs text-muted-foreground">{val.length}/50</span>
                        </div>
                        <textarea
                          rows={3}
                          maxLength={50}
                          placeholder={(isEn && option.placeholder_en) ? option.placeholder_en : option.placeholder}
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
                        <h3 className="font-display font-semibold text-lg">{(isEn && option.label_en) ? option.label_en : option.label}</h3>
                        {option.required && (
                          <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">{t("productPage.requiredChoice")}</span>
                        )}
                      </div>
                      {option.maxSelect && (
                        <p className="text-xs text-muted-foreground mb-2">
                          {((selections[option.id] as string[]) || []).length} / {option.maxSelect} {t("productPage.selectedCount")}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {(isEn && option.choices_en ? option.choices_en : option.choices).map((choice) => {
                          const arr = (selections[option.id] as string[]) || [];
                          const count = option.maxSelect ? arr.filter((c) => c === choice).length : 0;
                          const isSelected = option.maxSelect ? count > 0 : option.multiSelect ? arr.includes(choice) : selections[option.id] === choice;
                          const totalReached = option.maxSelect ? arr.length >= option.maxSelect : false;
                          const cleanChoice = choice.replace(/\s*\(\+[0-9,]+€\)/, "").replace(/\s*\(\+€[0-9.]+\)/, "");
                          const selArr = Array.isArray(selections[option.id]) ? (selections[option.id] as string[]) : [];
                          const withPriceArr = option.firstFree ? selArr.filter((c) => extractSupplement(c) > 0) : [];
                          const paidItems = option.firstFree ? withPriceArr.slice(option.firstFree) : [];
                          const supplement = extractSupplement(choice);
                          const isPaid = option.firstFree ? isSelected && paidItems.includes(choice) : isSelected && supplement > 0;
                          const showPriceBadge = supplement > 0 && (isSelected ? isPaid : (!option.firstFree || withPriceArr.length >= option.firstFree));
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
                              {showPriceBadge && (
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
                    <><Check size={20} /> {t("productPage.addedFull")}</>
                  ) : (
                    <><ShoppingBag size={20} /> {t("productPage.addToCartFull", { price: fmt(totalWithQty) })}</>
                  )}
                </button>
              </div>
              {!allSelected && (
                <p className="text-sm text-amber-600 font-medium">
                  {t("productPage.requiredOptions")}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground border border-border rounded-2xl px-4 py-3">
              <span className="text-xl">🚴</span>
              <span>{t("productPage.deliveryFull")}</span>
            </div>
          </div>
        </div>

        {/* Produits similaires */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-2xl font-semibold mb-8">{t("productPage.youMightAlsoLike")}</h2>
            <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(lp(`/produit/${item.id}`))}
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
                    <h3 className="font-display font-semibold text-sm">{isEn ? (item.name_en || item.name) : item.name}</h3>
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
