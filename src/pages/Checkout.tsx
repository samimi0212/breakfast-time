import { useState, useEffect, useRef } from "react";
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

  for (let h = 8; h < 15; h++) {
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
    complement: "",
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
  const [deliveryPrice, setDeliveryPrice] = useState<number | null>(null);
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [deliveryError, setDeliveryError] = useState("");
  const [suggestions, setSuggestions] = useState<{ description: string; place_id: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsTimer = useRef<any>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showCustomDate, setShowCustomDate] = useState(false);

  const isCoordComplete = !!(form.prenom && form.nom && form.email && form.telephone);
  const isAdresseComplete = !!(form.adresse && form.ville && form.codePostal && deliveryPrice !== null);
  const isCreneauComplete = !!(form.date && form.heure);

  const sectionClass = (name: string, complete: boolean) => {
    const isActive = activeSection === name;
    return `bg-white rounded-2xl p-6 transition-all duration-200 ${
      isActive
        ? "ring-2 ring-primary shadow-md"
        : complete
        ? "ring-2 ring-green-400"
        : ""
    }`;
  };

  const SectionTitle = ({ icon: Icon, title, complete }: { icon: any; title: string; complete: boolean }) => (
    <div className="flex items-center gap-3 mb-5">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${complete ? "bg-green-100" : "bg-primary/10"}`}>
        {complete
          ? <span className="text-green-500 font-bold text-sm">✓</span>
          : <Icon size={16} className="text-primary" />
        }
      </div>
      <h2 className="font-display text-lg font-semibold">{title}</h2>
    </div>
  );

  useEffect(() => {
    if (items.length === 0) navigate("/panier");
  }, [items]);

  useEffect(() => {
    const newSlots = generateSlots(form.date);
    setSlots(newSlots);
    setForm((prev) => ({ ...prev, heure: newSlots[0] || "" }));
  }, [form.date]);

  // Calcul des frais de livraison dès que l'adresse est complète
  useEffect(() => {
    if (!form.adresse || !form.codePostal || !form.ville) {
      setDeliveryPrice(null);
      setDeliveryError("");
      return;
    }
    const fullAddress = `${form.adresse}, ${form.codePostal} ${form.ville}, France`;
    const timer = setTimeout(async () => {
      setDeliveryLoading(true);
      setDeliveryError("");
      try {
        const res = await fetch("/api/get-delivery-price", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: fullAddress }),
        });
        const data = await res.json();
        if (!data.deliverable) {
          setDeliveryPrice(null);
          setDeliveryError(data.message || "Zone non desservie");
        } else {
          setDeliveryPrice(data.price);
          setDeliveryError("");
        }
      } catch {
        setDeliveryError("Impossible de calculer les frais de livraison");
      } finally {
        setDeliveryLoading(false);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [form.adresse, form.codePostal, form.ville]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, adresse: value }));
    setErrors((prev) => ({ ...prev, adresse: "" }));
    if (suggestionsTimer.current) clearTimeout(suggestionsTimer.current);
    if (value.length > 3) {
      suggestionsTimer.current = setTimeout(async () => {
        try {
          const res = await fetch("/api/autocomplete-address", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input: value }),
          });
          const data = await res.json();
          setSuggestions(data.predictions || []);
          setShowSuggestions(true);
        } catch { /* ignore */ }
      }, 400);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = async (placeId: string, description: string) => {
    setShowSuggestions(false);
    setSuggestions([]);
    setForm((prev) => ({ ...prev, adresse: description }));
    try {
      const res = await fetch("/api/place-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ place_id: placeId }),
      });
      const data = await res.json();
      setForm((prev) => ({
        ...prev,
        adresse: data.adresse || description,
        ville: data.ville || prev.ville,
        codePostal: data.codePostal || prev.codePostal,
      }));
    } catch { /* garde la description comme adresse */ }
  };

  const validateField = (name: string, value: string): string => {
    if (!value) return "Ce champ est requis";
    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Adresse email invalide";
    if (name === "telephone" && !/^(\+33|0)[1-9](\s?\d{2}){4}$/.test(value.replace(/[\s.\-()]/g, "")))
      return "Numéro de téléphone invalide";
    return "";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.prenom) e.prenom = "Ce champ est requis";
    if (!form.nom) e.nom = "Ce champ est requis";
    if (!form.email) {
      e.email = "Ce champ est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Adresse email invalide";
    }
    if (!form.telephone) {
      e.telephone = "Ce champ est requis";
    } else if (!/^(\+33|0)[1-9](\s?\d{2}){4}$/.test(form.telephone.replace(/[\s.\-()]/g, ""))) {
      e.telephone = "Numéro de téléphone invalide";
    }
    if (!form.adresse) e.adresse = "Ce champ est requis";
    if (!form.ville) e.ville = "Ce champ est requis";
    if (!form.codePostal) e.codePostal = "Ce champ est requis";
    if (!form.heure) e.heure = "Ce champ est requis";
    if (deliveryPrice === null) e.adresse = "Adresse hors zone de livraison (max 15 km)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (!stripe || !elements) return;

    setLoading(true);
    setErrors({});

    try {
      const orderTotal = total + (deliveryPrice ?? 0);

      // 1. Créer le PaymentIntent côté serveur
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: orderTotal }),
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

      const { data: insertedOrder, error: dbError } = await supabase.from("commandes").insert({
        user_id: session?.user?.id || null,
        user_email: form.email,
        user_prenom: form.prenom,
        user_nom: form.nom,
        user_telephone: form.telephone,
        adresse: form.complement ? `${form.adresse} — ${form.complement}` : form.adresse,
        ville: form.ville,
        code_postal: form.codePostal,
        date_livraison: form.date,
        heure_livraison: form.heure,
        note: form.note,
        items,
        total: orderTotal,
        frais_livraison: deliveryPrice,
        statut: "Payée",
      }).select().single();

      if (dbError) {
        console.error("Supabase insert error:", dbError);
      }

      // 4. Créer la livraison Stuart
      let trackingUrl = "";
      try {
        const stuartRes = await fetch("/api/create-stuart-delivery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order: {
              prenom: form.prenom,
              nom: form.nom,
              telephone: form.telephone,
              adresse: form.complement ? `${form.adresse} — ${form.complement}` : form.adresse,
              ville: form.ville,
              codePostal: form.codePostal,
              date: form.date,
              heure: form.heure,
              note: form.note,
              items,
              total,
            },
          }),
        });
        const stuartData = await stuartRes.json();
        if (stuartData.tracking_url) {
          trackingUrl = stuartData.tracking_url;
          // Mettre à jour la commande avec l'URL de suivi Stuart
          if (insertedOrder?.id) {
            await supabase
              .from("commandes")
              .update({ tracking_url: trackingUrl })
              .eq("id", insertedOrder.id);
          }
        }
      } catch (stuartErr) {
        console.error("Stuart error:", stuartErr);
      }

      // 5. Envoyer l'email de confirmation
      try {
        await fetch("/api/send-order-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order: {
              prenom: form.prenom,
              nom: form.nom,
              email: form.email,
              telephone: form.telephone,
              adresse: form.complement ? `${form.adresse} — ${form.complement}` : form.adresse,
              ville: form.ville,
              codePostal: form.codePostal,
              date: form.date,
              heure: form.heure,
              note: form.note,
              items,
              total: orderTotal,
              fraisLivraison: deliveryPrice,
              stripeId: paymentIntent?.id,
              trackingUrl,
            },
          }),
        });
      } catch (emailErr) {
        console.error("Email error:", emailErr);
      }

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
            <div
              className={sectionClass("coordonnees", isCoordComplete)}
              style={{ boxShadow: "var(--card-shadow)" }}
              onFocus={() => setActiveSection("coordonnees")}
              onBlur={() => setActiveSection(null)}
            >
              <SectionTitle icon={User} title="Vos coordonnées" complete={isCoordComplete} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Prénom</label>
                  <input name="prenom" value={form.prenom} onChange={handleChange} onBlur={handleBlur} placeholder="Marie" className={inputClass("prenom")} />
                  {errors.prenom && <p className="text-red-400 text-xs mt-1">{errors.prenom}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Nom</label>
                  <input name="nom" value={form.nom} onChange={handleChange} onBlur={handleBlur} placeholder="Dupont" className={inputClass("nom")} />
                  {errors.nom && <p className="text-red-400 text-xs mt-1">{errors.nom}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} onBlur={handleBlur} placeholder="marie@email.com" className={inputClass("email")} />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Téléphone</label>
                  <input name="telephone" type="tel" value={form.telephone} onChange={handleChange} onBlur={handleBlur} placeholder="+33 6 00 00 00 00" className={inputClass("telephone")} />
                  {errors.telephone && <p className="text-red-400 text-xs mt-1">{errors.telephone}</p>}
                </div>
              </div>
            </div>

            {/* Adresse de livraison */}
            <div
              className={sectionClass("adresse", isAdresseComplete)}
              style={{ boxShadow: "var(--card-shadow)" }}
              onFocus={() => setActiveSection("adresse")}
              onBlur={() => setActiveSection(null)}
            >
              <SectionTitle icon={MapPin} title="Adresse de livraison" complete={isAdresseComplete} />
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium mb-1.5">Adresse</label>
                  <input
                    name="adresse"
                    value={form.adresse}
                    onChange={handleAddressChange}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    placeholder="12 rue des Fleurs"
                    className={inputClass("adresse")}
                    autoComplete="off"
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-50 w-full bg-white border border-border rounded-xl shadow-lg mt-1 overflow-hidden">
                      {suggestions.map((s) => (
                        <button
                          key={s.place_id}
                          type="button"
                          onMouseDown={() => selectSuggestion(s.place_id, s.description)}
                          className="w-full text-left px-4 py-3 text-sm hover:bg-muted transition-colors border-b border-border last:border-0 flex items-center gap-2"
                        >
                          <span className="text-primary flex-shrink-0">📍</span>
                          <span className="truncate">{s.description}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.adresse && <p className="text-red-400 text-xs mt-1">{errors.adresse}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Complément d'adresse <span className="text-muted-foreground font-normal">(facultatif)</span>
                  </label>
                  <input
                    name="complement"
                    value={form.complement}
                    onChange={handleChange}
                    placeholder="Bât. B, 3ème étage, digicode 1234..."
                    className={inputClass("complement")}
                  />
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
            <div
              className={sectionClass("creneau", isCreneauComplete)}
              style={{ boxShadow: "var(--card-shadow)" }}
              onFocus={() => setActiveSection("creneau")}
              onBlur={() => setActiveSection(null)}
            >
              <SectionTitle icon={Clock} title="Créneau de livraison" complete={isCreneauComplete} />
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Date</label>
                <div className="flex gap-2 flex-wrap">
                  {Array.from({ length: 7 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() + i);
                    const iso = d.toISOString().split("T")[0];
                    const isSelected = form.date === iso && !showCustomDate;
                    const label = i === 0
                      ? "Aujourd'hui"
                      : i === 1
                      ? "Demain"
                      : d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
                    return (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({ ...prev, date: iso }));
                          setErrors((prev) => ({ ...prev, date: "" }));
                          setShowCustomDate(false);
                        }}
                        className={`px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all whitespace-nowrap ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-foreground hover:border-primary/50"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setShowCustomDate((v) => !v)}
                    className={`px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all whitespace-nowrap ${
                      showCustomDate
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-foreground hover:border-primary/50"
                    }`}
                  >
                    Autre date…
                  </button>
                </div>
                {showCustomDate && (
                  <div className="mt-3">
                    <input
                      type="date"
                      min={(() => { const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().split("T")[0]; })()}
                      value={showCustomDate && !Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d.toISOString().split("T")[0]; }).includes(form.date) ? form.date : ""}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, date: e.target.value }));
                        setErrors((prev) => ({ ...prev, date: "" }));
                      }}
                      className="px-4 py-2.5 rounded-xl border-2 border-primary bg-background text-foreground focus:outline-none focus:border-primary transition text-sm"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Heure</label>
                {slots.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">Aucun créneau disponible pour ce jour</p>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    {form.date === todayStr() && (() => {
                      const now = new Date();
                      const asap = new Date(now.getTime() + 45 * 60000);
                      // Arrondi au prochain créneau de 30min (Math.ceil)
                      const totalMin = asap.getHours() * 60 + asap.getMinutes();
                      const roundedMin = Math.ceil(totalMin / 30) * 30;
                      const asapH = Math.floor(roundedMin / 60);
                      const asapM = roundedMin % 60;
                      if (asapH >= 15) return null;
                      const asapSlot = `${String(asapH).padStart(2, "0")}:${String(asapM).padStart(2, "0")}`;
                      const isSelected = form.heure === asapSlot;
                      return (
                        <button
                          key="maintenant"
                          type="button"
                          onClick={() => {
                            setForm((prev) => ({ ...prev, heure: asapSlot }));
                            setErrors((prev) => ({ ...prev, heure: "" }));
                          }}
                          className={`px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all whitespace-nowrap ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-background text-foreground hover:border-primary/50"
                          }`}
                        >
                          Maintenant
                        </button>
                      );
                    })()}
                    {/* Créneaux réguliers : uniquement ceux APRÈS le créneau "Maintenant" */}
                    {slots.filter((s) => {
                      if (form.date !== todayStr()) return true;
                      const now = new Date();
                      const asap = new Date(now.getTime() + 45 * 60000);
                      const totalMin = asap.getHours() * 60 + asap.getMinutes();
                      const roundedMin = Math.ceil(totalMin / 30) * 30;
                      const slotMin = parseInt(s.split(":")[0]) * 60 + parseInt(s.split(":")[1]);
                      return slotMin > roundedMin;
                    }).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({ ...prev, heure: s }));
                          setErrors((prev) => ({ ...prev, heure: "" }));
                        }}
                        className={`px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                          form.heure === s
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-foreground hover:border-primary/50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                {errors.heure && <p className="text-red-400 text-xs mt-1">{errors.heure}</p>}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                🕐 Livraison disponible de 8h à 15h · Minimum 45 min après commande
              </p>
            </div>

            {/* Note pour le livreur */}
            <div
              className={sectionClass("note", false)}
              style={{ boxShadow: "var(--card-shadow)" }}
              onFocus={() => setActiveSection("note")}
              onBlur={() => setActiveSection(null)}
            >
              <h2 className="font-display text-lg font-semibold mb-4">Note pour le livreur</h2>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Instructions particulières..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition resize-none"
              />
            </div>

            {/* Paiement Stripe */}
            <div className={`bg-white rounded-2xl p-6 transition-opacity ${deliveryError ? "opacity-40 pointer-events-none" : ""}`} style={{ boxShadow: "var(--card-shadow)" }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <CreditCard size={16} className="text-primary" />
                </div>
                <h2 className="font-display text-lg font-semibold">Paiement par carte</h2>
              </div>

              {deliveryError && (
                <p className="text-red-400 text-sm mb-3 flex items-center gap-1.5">
                  <span>⚠️</span> Veuillez d'abord renseigner une adresse dans notre zone de livraison.
                </p>
              )}

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
                  {deliveryLoading ? (
                    <span className="text-muted-foreground italic">Calcul...</span>
                  ) : deliveryError ? (
                    <span className="text-red-400 text-xs">{deliveryError}</span>
                  ) : deliveryPrice !== null ? (
                    <span className="font-semibold text-foreground">{deliveryPrice.toFixed(2).replace(".", ",")}€</span>
                  ) : (
                    <span className="text-muted-foreground italic text-xs">Saisir une adresse</span>
                  )}
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">{(total + (deliveryPrice ?? 0)).toFixed(2).replace(".", ",")}€</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !stripe || deliveryPrice === null || deliveryLoading}
                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-semibold text-base hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <CreditCard size={18} />
                    Payer {(total + (deliveryPrice ?? 0)).toFixed(2).replace(".", ",")}€
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
