import { useState } from "react";
import { Calendar, Clock, Phone, Mail, User, MessageSquare } from "lucide-react";

interface FormData {
  eventType: "mariage" | "entreprise" | "groupe";
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  guestCount: string;
  message: string;
}

const EventBookingForm = () => {
  const [formData, setFormData] = useState<FormData>({
    eventType: "mariage",
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    guestCount: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const eventTypes = {
    mariage: { label: "Brunch Mariage", price: "À partir de 12€/pers" },
    entreprise: { label: "Brunch Entreprise", price: "À partir de 9€/pers" },
    groupe: { label: "Brunch Groupe", price: "À partir de 8€/pers" },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/.netlify/functions/send-event-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erreur lors de l'envoi");

      setSubmitted(true);
      setTimeout(() => {
        setFormData({
          eventType: "mariage",
          name: "",
          email: "",
          phone: "",
          eventDate: "",
          guestCount: "",
          message: "",
        });
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <span className="text-3xl">✓</span>
        </div>
        <h3 className="text-2xl font-display font-bold mb-2">Demande envoyée !</h3>
        <p className="text-muted-foreground">Nous vous recontacterons sous peu pour finaliser les détails.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      {/* Type d'événement */}
      <div className="mb-8">
        <label className="block text-sm font-semibold mb-4">Type d'événement</label>
        <div className="grid sm:grid-cols-3 gap-4">
          {(Object.entries(eventTypes) as [keyof typeof eventTypes, typeof eventTypes["mariage"]][]).map(
            ([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, eventType: key }))}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  formData.eventType === key
                    ? "border-primary bg-primary/5"
                    : "border-muted text-muted-foreground hover:border-primary"
                }`}
              >
                <div className="font-semibold text-foreground">{value.label}</div>
                <div className="text-sm mt-1">{value.price}</div>
              </button>
            )
          )}
        </div>
      </div>

      {/* Grille 2 colonnes pour les infos */}
      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {/* Nom */}
        <div>
          <label className="block text-sm font-semibold mb-2">Nom *</label>
          <div className="relative">
            <User size={18} className="absolute left-3 top-3.5 text-muted-foreground" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border-2 border-muted rounded-xl focus:border-primary focus:outline-none transition-colors"
              placeholder="Votre nom"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold mb-2">Email *</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3.5 text-muted-foreground" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border-2 border-muted rounded-xl focus:border-primary focus:outline-none transition-colors"
              placeholder="votre@email.com"
            />
          </div>
        </div>

        {/* Téléphone */}
        <div>
          <label className="block text-sm font-semibold mb-2">Téléphone *</label>
          <div className="relative">
            <Phone size={18} className="absolute left-3 top-3.5 text-muted-foreground" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border-2 border-muted rounded-xl focus:border-primary focus:outline-none transition-colors"
              placeholder="+33 6 00 00 00 00"
            />
          </div>
        </div>

        {/* Nombre de convives */}
        <div>
          <label className="block text-sm font-semibold mb-2">Nombre de convives *</label>
          <input
            type="number"
            name="guestCount"
            value={formData.guestCount}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-4 py-3 border-2 border-muted rounded-xl focus:border-primary focus:outline-none transition-colors"
            placeholder="Ex: 20"
          />
        </div>

        {/* Date de l'événement */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold mb-2">Date souhaitée *</label>
          <div className="relative">
            <Calendar size={18} className="absolute left-3 top-3.5 text-muted-foreground" />
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border-2 border-muted rounded-xl focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="mb-8">
        <label className="block text-sm font-semibold mb-2">Message (optionnel)</label>
        <div className="relative">
          <MessageSquare size={18} className="absolute left-3 top-3.5 text-muted-foreground" />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full pl-10 pr-4 py-3 border-2 border-muted rounded-xl focus:border-primary focus:outline-none transition-colors resize-none"
            placeholder="Détails supplémentaires, régime alimentaires, etc."
          />
        </div>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

      {/* Bouton */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: "#DFF057",
          color: "#3a3a0a",
        }}
      >
        {loading ? "Envoi en cours..." : "Demander un devis"}
      </button>

      <p className="text-center text-sm text-muted-foreground mt-4">Nous vous répondrons dans les 24h.</p>
    </form>
  );
};

export default EventBookingForm;
