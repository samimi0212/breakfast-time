import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Clock, MapPin, User, Lock } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const generateSlots = (date: string): string[] => {
  const slots: string[] = [];
  const now = new Date();
  const selected = new Date(date);
  const isToday = selected.toDateString() === now.toDateString();

  for (let h = 7; h < 15; h++) {
    for (let m = 0; m < 60; m += 30) {
      const slot = new Date(selected);
      slot.setHours(h, m, 0, 0);
      if (isToday) {
        const minTime = new Date(now.getTime() + 45 * 60000);
        if (slot < minTime) continue;
      }
      const hStr = String(h).padStart(2, "0");
      const mStr = String(m).padStart(2, "0");
      slots.push(`${hStr}:${mStr}`);
    }
  }
  return slots;
};

const todayStr = () => new Date().toISOString().split("T")[0];

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

const CheckoutForm = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
    codePostal: "",
    note: "",
    date: todayStr(),
    heure: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      const meta = session.user.user_metadata;
      setForm((prev) => ({
        ...prev,
        prenom: meta?.prenom || "",
        nom: meta?.nom || "",
        email: session.user.email || "",
        telephone: meta?.telephone || "",
      }));
    });
  }, []);

  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (items.length === 0) navigate("/panier");
  }, [items]);

  useEffect(() => {
    const newSlots = generateSlots(form.date);
    setSlots(newSlots);
    setForm((prev) => ({ ...prev, heure: newSlots[0] || "" }));
  }, [form.date]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.prenom) e.prenom = "Requis";
    if (!form.nom) e.nom = "Requis";
    if (!form.email) e.email = "Requis";
    if (!form.telephone) e.telephone = "Requis";
    if (!form.adresse) e.adresse = "Requis";
    if (!form.ville) e.ville = "Requis";
    if (!form.codePostal) e.codePostal = "Requis";
    if (!form.heure) e.heure = "Requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (!stripe || !elements) return;

    setLoading(true);
    setErrors({});

    try {
      // 1. Créer le PaymentIntent côté serveur
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      let data: any;
      try {
        data = await res.json();
      } catch {
        throw new Error("Erreur serveur. Veuillez réessayer dans quelques secondes.");
      }
      if (!res.ok || data.error) throw new Error(data.error || "Erreur lors de la création du paiement");

      // 2. Confirmer le paiement avec Stripe
      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement!,
          billing_details: {
            name: `${form.prenom} ${form.nom}`,
            email: form.email,
            phone: form.telephone,
          },
        },
      });

      if (stripeError) {
        setErrors({ general: stripeError.message || "Paiement refusé. Veuillez vérifier votre carte." });
        setLoading(false);
        return;
      }

      // 3. Enregistrer la commande dans Supabase
      const {
        data: { session },
      } = await supabase.auth.getSession();

      await supabase.from("commandes").insert({
        user_id: session?.user?.id || null,
        user_email: form.email,
        user_prenom: form.prenom,
        user_nom: form.nom,
        user_telephone: form.telephone,
        adresse: form.adresse,
        ville: form.ville,
        code_postal: form.codePostal,
        date_livraison: form.date,
        heure_livraison: form.heure,
        note: form.note,
        items,
        total,
        statut: "Payée",
        stripe_payment_id: paymentIntent?.id,
      });

      clearCart();
      navigate("/confirmation");
    } catch (err: any) {
      setErrors({ general: err.message || "Une erreur est survenue. Veuillez réessayer." });
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl border-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition ${
      errors[field] ? "border-red-400" : "border-border"
    }`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-28 pb-16 px-6 max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/panier")}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Retour au panier</span>
        </button>

        <h1 className="font-display text-3xl font-bold mb-8">Finaliser la commande</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {/* Coordonnées */}
            <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "var(--card-shadow)" }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <User size={16} className="text-primary" />
                </div>
                <h2 className="font-display text-lg font-semibold">Vos coordonnées</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Prénom</label>
                  <input name="prenom" value={form.prenom} onChange={handleChange} placeholder="Marie" className={inputClass("prenom")} />
                  {errors.prenom && <p className="text-red-400 text-xs mt-1">{errors.prenom}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Nom</label>
                  <input name="nom" value={form.nom} onChange={handleChange} placeholder="Dupont" className={inputClass("nom")} />
                  {errors.nom && <p className="text-red-400 text-xs mt-1">{errors.nom}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="marie@email.com" className={inputClass("email")} />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Téléphone</label>
                  <input name="telephone" type="tel" value={form.telephone} onChange={handleChange} placeholder="+33 6 00 00 00 00" className={inputClass("telephone")} />
                  {errors.telephone && <p className="text-red-400 text-xs mt-1">{errors.telephone}</p>}
                </div>
              </div>
            </div>

            {/* Adresse de livraison */}
            <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "var(--card-shadow)" }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <MapPin size={16} className="text-primary" />
                </div>
                <h2 className="font-display text-lg font-semibold">Adresse de livraison</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Adresse</label>
                  <input name="adresse" value={form.adresse} onChange={handleChange} placeholder="12 rue des Fleurs" className={inputClass("adresse")} />
                  {errors.adresse && <p className="text-red-400 text-xs mt-1">{errors.adresse}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Ville</label>
                    <input name="ville" value={form.ville} onChange={handleChange} placeholder="Nice" className={inputClass("ville")} />
                    {errors.ville && <p className="text-red-400 text-xs mt-1">{errors.ville}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Code postal</label>
                    <input name="codePostal" value={form.codePostal} onChange={handleChange} placeholder="06000" className={inputClass("codePostal")} />
                    {errors.codePostal && <p className="text-red-400 text-xs mt-1">{errors.codePostal}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Créneau de livraison */}
            <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "var(--card-shadow)" }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Clock size={16} className="text-primary" />
                </div>
                <h2 className="font-display text-lg font-semibold">Créneau de livraison</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Date</label>
                  <input name="date" type="date" value={form.date} min={todayStr()} onChange={handleChange} className={inputClass("date")} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Heure</label>
                  <select name="heure" value={form.heure} onChange={handleChange} className={inputClass("heure")}>
                    {slots.length === 0 ? (
                      <option value="">Aucun créneau disponible</option>
                    ) : (
                      slots.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))
                    )}
                  </select>
                  {errors.heure && <p className="text-red-400 text-xs mt-1">{errors.heure}</p>}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                🕐 Livraison disponible de 7h à 15h · Minimum 45 min après commande
              </p>
            </div>

            {/* Note pour le livreur */}
            <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "var(--card-shadow)" }}>
              <h2 className="font-display text-lg font-semibold mb-4">Note pour le livreur</h2>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Code d'entrée, étage, instructions particulières..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition resize-none"
              />
            </div>

            {/* Paiement Stripe */}
            <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "var(--card-shadow)" }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <CreditCard size={16} className="text-primary" />
                </div>
                <h2 className="font-display text-lg font-semibold">Paiement par carte</h2>
              </div>

              <div className="border-2 border-border rounded-xl px-4 py-4 focus-within:border-primary transition">
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </div>

              {errors.general && (
                <p className="text-red-400 text-sm mt-3 flex items-center gap-1.5">
                  <span>⚠️</span> {errors.general}
                </p>
              )}

              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
                <Lock size={11} />
                Paiement 100% sécurisé — vos données bancaires ne sont jamais stockées sur nos serveurs
              </p>
            </div>

          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-24" style={{ boxShadow: "var(--card-shadow)" }}>
              <h2 className="font-display text-lg font-bold mb-4">Récapitulatif</h2>

              <div className="space-y-3 mb-4">
                {items.map((item, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <img src={item.img} alt={item.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item.name}</p>
                      {item.options && Object.keys(item.options).length > 0 && (
                        <p className="text-xs text-muted-foreground truncate">
                          {Object.values(item.options).flatMap((v) => Array.isArray(v) ? v : [v]).join(", ")}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">x{item.qty}</p>
                    </div>
                    <p className="text-sm font-bold text-primary flex-shrink-0">
                      {(parseFloat(item.price.replace("€", "").replace(",", ".")) * item.qty)
                        .toFixed(2)
                        .replace(".", ",")}€
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Sous-total</span>
                  <span>{total.toFixed(2).replace(".", ",")}€</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Livraison</span>
                  <span className="text-primary font-semibold">Gratuite</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">{total.toFixed(2).replace(".", ",")}€</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !stripe}
                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-semibold text-base hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <CreditCard size={18} />
                    Payer {total.toFixed(2).replace(".", ",")}€
                  </>
                )}
              </button>

              <p className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center gap-1">
                <Lock size={11} />
                Paiement sécurisé par Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Checkout = () => (
  <Elements stripe={stripePromise} options={{ locale: "fr" }}>
    <CheckoutForm />
  </Elements>
);

export default Checkout;
