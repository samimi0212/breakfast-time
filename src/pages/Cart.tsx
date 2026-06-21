import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, UtensilsCrossed } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLangPath } from "@/hooks/useLangPath";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const Cart = () => {
  const { items, removeItem, updateQty, total, clearCart } = useCart();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { lp } = useLangPath();
  const [wantsCutlery, setWantsCutlery] = useState(false);
  const [cutleryQty, setCutleryQty] = useState(1);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");

  const VALID_PROMOS: Record<string, number> = { BONJOUR20: 0.20, BIENVENUE10: 0.10, RETOUR: 0 };

  useEffect(() => {
    const stored = sessionStorage.getItem("bt_promo_code");
    if (stored) setPromoCode(stored);
  }, []);

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (VALID_PROMOS[code]) {
      sessionStorage.setItem("bt_promo_code", code);
      setPromoCode(code);
      setPromoInput("");
      setPromoError("");
    } else {
      setPromoError("Code invalide");
    }
  };

  const removePromo = () => {
    sessionStorage.removeItem("bt_promo_code");
    setPromoCode(null);
    setPromoError("");
  };

  const promoDiscount = promoCode ? (VALID_PROMOS[promoCode] ?? 0) : 0;
  const MIN_ORDER = 15;
  const subtotalWithCutlery = total + (wantsCutlery ? cutleryQty * 0.80 : 0);
  const orderTotal = subtotalWithCutlery * (1 - promoDiscount);
  const isMinReached = orderTotal >= MIN_ORDER;
  const progressPct = Math.min((orderTotal / MIN_ORDER) * 100, 100);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-16 px-6 max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} className="text-muted-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-3">{t("cart.emptyTitle")}</h1>
          <p className="text-muted-foreground mb-8">
            {t("cart.emptyText")}
          </p>
          <button
            onClick={() => navigate(lp("/") + "#menu")}
            className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            {t("cart.emptyCta")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-28 pb-16 px-6 max-w-4xl mx-auto">

        {/* Retour */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">{t("cart.backBtn")}</span>
        </button>

        <h1 className="font-display text-3xl font-bold mb-8">{t("cart.title")}</h1>

        <div className="grid lg:grid-cols-5 gap-8">

          {/* Liste produits */}
          <div className="lg:col-span-3 space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-4 flex gap-4 items-start"
                style={{ boxShadow: "var(--card-shadow)" }}
              >
                {/* Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-base mb-1">{item.name}</h3>

                  {/* Options choisies */}
                  {item.options && Object.keys(item.options).length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {Object.entries(item.options).map(([key, value]) =>
                        (Array.isArray(value) ? value : [value]).map((v) => (
                        <span
                          key={key + v}
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: "#DFF057", color: "#5a5a1a" }}
                        >
                          {v}
                        </span>
                        ))
                      )}
                    </div>
                  )}

                  <p className="text-primary font-bold">{item.price}</p>
                </div>

                {/* Quantité + Supprimer */}
                <div className="flex flex-col items-end gap-3">
                  <button
                    onClick={() => removeItem(index)}
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="flex items-center gap-2 bg-muted rounded-xl px-2 py-1">
                    <button
                      onClick={() => updateQty(index, Math.max(1, item.qty - 1))}
                      className="w-6 h-6 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="font-semibold text-sm w-6 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(index, item.qty + 1)}
                      className="w-6 h-6 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <p className="text-sm font-semibold text-foreground">
                    {(parseFloat(item.price.replace("€", "").replace(",", ".")) * item.qty).toFixed(2).replace(".", ",")}€
                  </p>
                </div>
              </div>
            ))}

            {/* Couverts */}
            <div
              className="bg-white rounded-2xl p-4 mt-2"
              style={{ boxShadow: "var(--card-shadow)" }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <UtensilsCrossed size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t("cart.cutleryTitle")} <span className="text-muted-foreground font-normal">— {t("cart.cutleryPrice")}</span></p>
                    <p className="text-xs text-muted-foreground">{t("cart.cutleryQuestion")}</p>
                  </div>
                </div>
                {/* Toggle */}
                <button
                  onClick={() => setWantsCutlery(!wantsCutlery)}
                  className="relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
                  style={{ backgroundColor: wantsCutlery ? "hsl(61,45%,42%)" : "#e5e7eb" }}
                >
                  <span
                    className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200"
                    style={{ left: wantsCutlery ? "calc(100% - 22px)" : "2px" }}
                  />
                </button>
              </div>

              {/* Quantité */}
              {wantsCutlery && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">{t("cart.cutleryQtyLabel")}</p>
                  <div className="flex items-center gap-2 bg-muted rounded-xl px-2 py-1">
                    <button
                      onClick={() => setCutleryQty(Math.max(1, cutleryQty - 1))}
                      className="w-6 h-6 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="font-semibold text-sm w-6 text-center">{cutleryQty}</span>
                    <button
                      onClick={() => setCutleryQty(cutleryQty + 1)}
                      className="w-6 h-6 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Vider le panier */}
            <button
              onClick={clearCart}
              className="text-sm text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1 mt-2"
            >
              <Trash2 size={14} />
              {t("cart.clearCart")}
            </button>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-2">
            <div
              className="bg-white rounded-2xl p-8 sticky top-24"
              style={{ boxShadow: "var(--card-shadow)" }}
            >
              <h2 className="font-display text-xl font-bold mb-6">{t("cart.summaryTitle")}</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{t("cart.subtotal")}</span>
                  <span>{total.toFixed(2).replace(".", ",")}€</span>
                </div>
                {wantsCutlery && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{t("cart.cutleryLine", { count: cutleryQty })}</span>
                    <span>{(cutleryQty * 0.80).toFixed(2).replace(".", ",")}€</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{t("cart.deliveryLabel")}</span>
                  <span className="italic text-xs">{t("cart.deliveryCalc")}</span>
                </div>
                {promoCode && (
                  <div className="flex justify-between text-sm font-semibold" style={{ color: "#5a7a0a" }}>
                    <span>🎉 Code {promoCode}</span>
                    <span>-{(subtotalWithCutlery * promoDiscount).toFixed(2).replace(".", ",")}€</span>
                  </div>
                )}
                <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                  <span>{t("cart.total")}</span>
                  <span className="text-primary">{orderTotal.toFixed(2).replace(".", ",")}€</span>
                </div>
              </div>

              {/* Code promo */}
              {promoCode ? (
                <div className="flex items-center justify-between bg-muted rounded-xl px-4 py-2.5 mb-4">
                  <span className="text-sm font-semibold whitespace-nowrap" style={{ color: "#5a7a0a" }}>🎉 {promoCode} — appliqué</span>
                  <button onClick={removePromo} className="text-xs text-muted-foreground hover:text-red-500 transition-colors ml-3 whitespace-nowrap flex-shrink-0">Retirer</button>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="flex gap-2 w-full min-w-0">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => { setPromoInput(e.target.value); setPromoError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                      placeholder="Code promo"
                      className="min-w-0 flex-1 px-3 py-2.5 rounded-xl border-2 border-border text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                    <button
                      onClick={applyPromo}
                      className="flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      Appliquer
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-xs text-red-500 mt-1.5 ml-1">{promoError}</p>
                  )}
                </div>
              )}

              {/* Barre minimum de commande */}
              {!isMinReached && (
                <div className="mb-5">
                  <div className="flex text-xs font-medium mb-2">
                    <span className="text-muted-foreground">{t("cart.minOrder")}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%`, backgroundColor: "#DFF057" }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={async () => {
                  if (!isMinReached) return;
                  const { data: { session } } = await supabase.auth.getSession();
                  if (session) {
                    navigate(lp("/commande"));
                  } else {
                    navigate(lp("/connexion") + "?redirect=%2Fcommande");
                  }
                }}
                disabled={!isMinReached}
                className={`w-full py-5 rounded-2xl font-semibold text-lg transition-opacity ${
                  isMinReached
                    ? "bg-primary text-primary-foreground hover:opacity-90 cursor-pointer"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {t("cart.checkoutBtn")}
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
