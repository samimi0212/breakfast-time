import { useState } from "react";
import { Phone, User, Mail, Calendar, Clock } from "lucide-react";

interface AppointmentData {
  name: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  notes: string;
}

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
];

const PhoneAppointmentForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState<AppointmentData>({
    name: "",
    email: "",
    phone: "",
    date: "",
    timeSlot: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.timeSlot) {
      setError("Veuillez choisir un créneau horaire");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/send-appointment-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erreur lors de l'envoi");

      setSubmitted(true);
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <Phone className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-display font-bold mb-2">RDV demandé !</h3>
        <p className="text-muted-foreground mb-6">
          Nous vous appellerons le {new Date(formData.date).toLocaleDateString("fr-FR")} à {formData.timeSlot}.
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-full font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          Fermer
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
          <Phone className="w-7 h-7 text-primary" />
        </div>
        <h3 className="font-display text-2xl font-bold mb-2">Prendre rendez-vous</h3>
        <p className="text-muted-foreground text-sm">Échangeons sur votre projet en 15 minutes par téléphone.</p>
      </div>

      {/* Nom + Email */}
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Nom *</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-9 pr-3 py-2.5 border-2 border-muted rounded-xl focus:border-primary focus:outline-none transition-colors text-sm"
              placeholder="Votre nom"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Email *</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-3 text-muted-foreground" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-9 pr-3 py-2.5 border-2 border-muted rounded-xl focus:border-primary focus:outline-none transition-colors text-sm"
              placeholder="votre@email.com"
            />
          </div>
        </div>
      </div>

      {/* Téléphone */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Téléphone *</label>
        <div className="relative">
          <Phone size={16} className="absolute left-3 top-3 text-muted-foreground" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full pl-9 pr-3 py-2.5 border-2 border-muted rounded-xl focus:border-primary focus:outline-none transition-colors text-sm"
            placeholder="+33 6 00 00 00 00"
          />
        </div>
      </div>

      {/* Date */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Date *</label>
        <div className="relative">
          <Calendar size={16} className="absolute left-3 top-3 text-muted-foreground" />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={today}
            required
            className="w-full pl-9 pr-3 py-2.5 border-2 border-muted rounded-xl focus:border-primary focus:outline-none transition-colors text-sm"
          />
        </div>
      </div>

      {/* Créneaux horaires */}
      {formData.date && (
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            <Clock size={14} className="inline mr-1" />
            Choisissez un créneau *
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, timeSlot: slot }))}
                className={`py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                  formData.timeSlot === slot
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted text-foreground hover:border-primary"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Sujet (optionnel)</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
          className="w-full px-3 py-2.5 border-2 border-muted rounded-xl focus:border-primary focus:outline-none transition-colors resize-none text-sm"
          placeholder="Type d'événement, nombre de convives..."
        />
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 rounded-full font-semibold border-2 border-muted text-muted-foreground hover:bg-muted transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 rounded-full font-semibold transition-all hover:scale-105 disabled:opacity-50"
          style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
        >
          {loading ? "Envoi..." : "Confirmer le RDV"}
        </button>
      </div>
    </form>
  );
};

export default PhoneAppointmentForm;
