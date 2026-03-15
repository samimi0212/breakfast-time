import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, CreditCard, Clock, MapPin, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";

// Génère les créneaux horaires disponibles
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

// Format date pour input
const todayStr = () => {
  const d = new Date();
  return d.toISOString().split("T")[0];
};

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

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
    setLoading(true);
    // Stripe sera intégré ici
    setTimeout(() => {
      setLoading(false);
      alert("Redirection vers Stripe... (à connecter)");
    }, 1000);
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl border-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition ${
      errors[field] ? "border-red-400" : "border-border"
    }`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-28 pb-16 px-6 max-w-5xl mx-auto">

        {/* Retour */}
        <button
          onClick={() => navigate("/panier")}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Retour au panier</span>
        </button>

        <h1 className="font-display text-3xl font-bold mb-8">Finaliser la commande</h1>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Formulaire */}
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

            {/* Adresse */}
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

            {/* Créneau */}
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
                  <input
                    name="date"
                    type="date"
                    value={form.date}
                    min={todayStr()}
                    onChange={handleChange}
                    className={inputClass("date")}
                  />
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

            {/* Note */}
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

          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-24" style={{ boxShadow: "var(--card-shadow)" }}>
              <h2 className="font-display text-lg font-bold mb-4">Récapitulatif</h2>

              {/* Produits */}
              <div className="space-y-3 mb-4">
                {items.map((item, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <img src={item.img} alt={item.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item.name}</p>
                      {item.options && Object.keys(item.options).length > 0 && (
                        <p className="text-xs text-muted-foreground truncate">
                          {Object.values(item.options).join(", ")}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">x{item.qty}</p>
                    </div>
                    <p className="text-sm font-bold text-primary flex-shrink-0">
                      {(parseFloat(item.price.replace("€", "").replace(",", ".")) * item.qty).toFixed(2).replace(".", ",")}€
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

              {/* Bouton payer */}
              <button
                onClick={handleSubmit}
                disabled={loading}
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
                🔒 Paiement sécurisé par Stripe
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
