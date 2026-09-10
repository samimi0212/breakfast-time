import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GiftCardPreview from "@/components/GiftCardPreview";
import { useTranslation } from "react-i18next";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useLangPath } from "@/hooks/useLangPath";
import { supabase } from "@/lib/supabase";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Lock } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: true,
  style: {
    base: {
      fontSize: "16px",
      color: "#1a1a0a",
      fontFamily: "system-ui, sans-serif",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: { color: "#ef4444" },
  },
};

const generateCode = () => {
  const seg = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${seg()}-${seg()}-${seg()}`;
};

const AMOUNTS = [25, 40, 60];

const GiftCardForm = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { lp } = useLangPath();
  const stripe = useStripe();
  const elements = useElements();
  usePageMeta("Carte Cadeau | Breakfast Time", "Offrez un brunch Breakfast Time : carte cadeau originale pour toutes les occasions.", "/carte-cadeau");

  const previewExpiresAt = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toLocaleDateString(i18n.language === "en" ? "en-GB" : "fr-FR");
  })();

  const [amount, setAmount] = useState<number | "custom">(40);
  const [customAmount, setCustomAmount] = useState("");
  const [showAmount, setShowAmount] = useState(false);
  const [sendToSelf, setSendToSelf] = useState(false);
  const [form, setForm] = useState({ from: "", to: "", message: "", recipientEmail: "", buyerEmail: "" });
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [previewCode] = useState("XXXX-XXXX-XXXX");
  const [previewTab, setPreviewTab] = useState<"recto" | "verso">("verso");

  const finalAmount = amount === "custom" ? Number(customAmount) : amount;
  const previewAmount = finalAmount > 0 ? `${finalAmount}€` : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!finalAmount || finalAmount <= 0) {
      setError(t("giftCard.errorAmount"));
      return false;
    }
    if (!form.from || !form.to || !form.buyerEmail || (!sendToSelf && !form.recipientEmail)) {
      setError(t("giftCard.errorRequired"));
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validate()) return;
    if (!stripe || !elements) return;

    setError("");
    setPaying(true);

    try {
      // 1. Créer le PaymentIntent
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Erreur de paiement");

      // 2. Confirmer le paiement
      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement!,
          billing_details: { email: form.buyerEmail },
        },
      });

      if (stripeError) {
        setError(stripeError.message || "Le paiement a échoué.");
        setPaying(false);
        return;
      }

      // 3. Générer le code et créer la carte cadeau en base (avec retry si collision de code)
      const expiresAtDate = new Date();
      expiresAtDate.setFullYear(expiresAtDate.getFullYear() + 1);

      let code = generateCode();
      let created = false;
      for (let attempt = 0; attempt < 3 && !created; attempt++) {
        const { error: rpcError } = await supabase.rpc("create_gift_card", {
          p_code: code,
          p_amount: finalAmount,
          p_buyer_email: form.buyerEmail,
          p_card_from: form.from,
          p_card_to: form.to,
          p_message: form.message,
          p_show_amount: showAmount,
          p_expires_at: expiresAtDate.toISOString(),
          p_stripe_payment_intent_id: paymentIntent?.id ?? null,
        });
        if (!rpcError) {
          created = true;
        } else {
          code = generateCode();
        }
      }
      if (!created) throw new Error("Impossible de générer la carte cadeau, contactez-nous.");

      // 4. Envoyer l'email avec le lien vers la carte
      const recipientEmail = sendToSelf ? form.buyerEmail : form.recipientEmail;
      await fetch("/api/send-gift-card-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail,
          cardFrom: form.from,
          cardTo: form.to,
          message: form.message,
          amount: showAmount ? previewAmount : null,
          code,
          expiresAt: expiresAtDate.toLocaleDateString(i18n.language === "en" ? "en-GB" : "fr-FR"),
        }),
      });

      // 5. Rediriger vers la page de visualisation de la carte
      const viewParams = new URLSearchParams({
        from: form.from,
        to: form.to,
        code,
        expiresAt: expiresAtDate.toLocaleDateString(i18n.language === "en" ? "en-GB" : "fr-FR"),
        ...(form.message ? { message: form.message } : {}),
        ...(showAmount ? { amount: previewAmount } : {}),
      });
      navigate(lp(`/carte-cadeau/voir?${viewParams.toString()}`));
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Une erreur est survenue, réessayez.");
      setPaying(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground placeholder:text-sm placeholder:italic focus:outline-none focus:border-primary transition";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">{t("giftCard.label")}</p>
            <h1 className="font-display text-3xl font-bold mb-3">{t("giftCard.title")}</h1>
            <p className="text-muted-foreground">{t("giftCard.subtitle")}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="bg-white rounded-2xl p-8 space-y-6" style={{ boxShadow: "var(--card-shadow)" }}>
              <div>
                <label className="block text-sm font-medium mb-2">{t("giftCard.amountLabel")}</label>
                <div className="flex flex-wrap gap-2">
                  {AMOUNTS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAmount(a)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                        amount === a ? "bg-primary text-primary-foreground border-primary" : "bg-white border-border text-foreground hover:border-primary"
                      }`}
                    >
                      {a}€
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAmount("custom")}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                      amount === "custom" ? "bg-primary text-primary-foreground border-primary" : "bg-white border-border text-foreground hover:border-primary"
                    }`}
                  >
                    {t("giftCard.amountCustom")}
                  </button>
                </div>
                {amount === "custom" && (
                  <input
                    type="number"
                    min={1}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder={t("giftCard.amountCustomPlaceholder")}
                    className={`${inputClass} mt-3`}
                  />
                )}
                <label className="flex items-center gap-2 text-sm cursor-pointer mt-3">
                  <input type="checkbox" checked={showAmount} onChange={(e) => setShowAmount(e.target.checked)} className="w-4 h-4 accent-primary" />
                  {t("giftCard.showAmountOnCard")}
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">{t("giftCard.fromLabel")} <span className="text-red-400">*</span></label>
                <input name="from" value={form.from} onChange={handleChange} placeholder={t("giftCard.fromPlaceholder")} className={inputClass} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">{t("giftCard.toLabel")} <span className="text-red-400">*</span></label>
                <input name="to" value={form.to} onChange={handleChange} placeholder={t("giftCard.toPlaceholder")} className={inputClass} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">{t("giftCard.messageLabel")}</label>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder={t("giftCard.messagePlaceholder")} rows={3} className={`${inputClass} resize-none`} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">{t("giftCard.yourEmailLabel")} <span className="text-red-400">*</span></label>
                <input name="buyerEmail" type="email" value={form.buyerEmail} onChange={handleChange} placeholder={t("giftCard.yourEmailPlaceholder")} className={inputClass} />
              </div>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={sendToSelf} onChange={(e) => setSendToSelf(e.target.checked)} className="w-4 h-4 accent-primary" />
                {t("giftCard.sendToSelf")}
              </label>

              {!sendToSelf && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">{t("giftCard.recipientEmailLabel")} <span className="text-red-400">*</span></label>
                  <input name="recipientEmail" type="email" value={form.recipientEmail} onChange={handleChange} placeholder={t("giftCard.recipientEmailPlaceholder")} className={inputClass} />
                  <p className="italic text-xs text-muted-foreground mt-1">{t("giftCard.recipientEmailNote")}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1.5">Carte bancaire</label>
                <div className={inputClass}>
                  <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                onClick={handlePayment}
                disabled={paying || !stripe}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {paying ? "Paiement en cours..." : `Payer ${finalAmount > 0 ? finalAmount : ""}€`}
              </button>

              <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                <Lock size={11} />
                Paiement sécurisé par Stripe
              </p>

              <p className="text-xs text-muted-foreground text-center">{t("giftCard.validityNote")}</p>
            </div>

            <div className="lg:sticky lg:top-32">
              <p className="text-sm font-medium text-muted-foreground mb-3 text-center">{t("giftCard.previewLabel")}</p>

              <div className="flex justify-center gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setPreviewTab("recto")}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border-2 transition-all duration-200 ${
                    previewTab === "recto" ? "bg-primary text-primary-foreground border-primary" : "bg-white border-border text-foreground hover:border-primary"
                  }`}
                >
                  {t("giftCard.previewRecto")}
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab("verso")}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border-2 transition-all duration-200 ${
                    previewTab === "verso" ? "bg-primary text-primary-foreground border-primary" : "bg-white border-border text-foreground hover:border-primary"
                  }`}
                >
                  {t("giftCard.previewVerso")}
                </button>
              </div>

              <div className={previewTab === "recto" ? "" : "hidden"}>
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1748 / 1240", boxShadow: "var(--card-shadow)" }}>
                  <img src="/carte-cadeau-recto.webp" alt="Aperçu du recto de la carte cadeau" className="absolute inset-0 w-full h-full object-contain" />
                </div>
              </div>

              <div className={previewTab === "verso" ? "" : "hidden"}>
                <GiftCardPreview
                  from={form.from}
                  to={form.to}
                  message={form.message}
                  code={previewCode}
                  expiresAt={previewExpiresAt}
                  amount={showAmount ? previewAmount : undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

const GiftCard = () => (
  <Elements stripe={stripePromise} options={{ locale: "fr" }}>
    <GiftCardForm />
  </Elements>
);

export default GiftCard;
