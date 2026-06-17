import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { usePageMeta } from "@/hooks/usePageMeta";

const Contact = () => {
  const { t } = useTranslation();
  usePageMeta("Contact | Breakfast Time", "Contactez Breakfast Time pour toute question ou demande spéciale.", "/contact", true);

  const [form, setForm] = useState({ nom: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.nom || !form.email || !form.message) {
      setError(t("contact.errorRequired"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/send-contact-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
      setForm({ nom: "", email: "", message: "" });
    } catch {
      setError(t("contact.errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-16 px-6">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">{t("contact.label")}</p>
            <h1 className="font-display text-3xl font-bold mb-3">{t("contact.title")}</h1>
            <p className="text-muted-foreground">{t("contact.subtitle")}</p>
          </div>

          {success ? (
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">✅</div>
              <h2 className="font-display text-xl font-semibold mb-2">{t("contact.successTitle")}</h2>
              <p className="text-muted-foreground">{t("contact.successText")}</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 space-y-5" style={{ boxShadow: "var(--card-shadow)" }}>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t("contact.nameLabel")}</label>
                <input name="nom" value={form.nom} onChange={handleChange} placeholder={t("contact.namePlaceholder")} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t("contact.emailLabel")}</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder={t("contact.emailPlaceholder")} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t("contact.messageLabel")}</label>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder={t("contact.messagePlaceholder")} rows={5} className={`${inputClass} resize-none`} />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : t("contact.submit")}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
