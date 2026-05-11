import { useState } from "react";
import { Instagram, Facebook, Mail, MapPin, Clock, CheckCircle, Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    try {
      const res = await fetch("/api/send-newsletter-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
  <footer className="bg-foreground" style={{ color: "hsl(var(--background))" }}>
    {/* Contenu principal */}
    <div className="px-6 py-16 max-w-6xl mx-auto">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Logo + description */}
        <div className="lg:col-span-1">
          <img src={logo} alt="Breakfast Time" className="h-16 w-auto mb-4 brightness-0 invert" />
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
            Des petits-déjeuners et brunchs d'exception livrés chez vous dans les Alpes-Maritimes.
          </p>
          <div className="flex gap-3 mt-6">
            <a
              href="#"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ backgroundColor: "rgba(223,240,87,0.15)" }}
            >
              <Instagram size={18} style={{ color: "#DFF057" }} />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ backgroundColor: "rgba(223,240,87,0.15)" }}
            >
              <Facebook size={18} style={{ color: "#DFF057" }} />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-semibold text-sm tracking-widest uppercase mb-5" style={{ color: "#DFF057" }}>
            Navigation
          </h4>
          <ul className="space-y-3 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            <li>
              <a href="/carte" className="hover:text-white transition-colors">
                La Carte
              </a>
            </li>
            <li>
              <a href="/#how" className="hover:text-white transition-colors">
                Comment ça marche
              </a>
            </li>
            <li>
              <a href="/#about" className="hover:text-white transition-colors">
                À propos
              </a>
            </li>
            <li>
              <a href="/#delivery" className="hover:text-white transition-colors">
                Zone de livraison
              </a>
            </li>
            <li>
              <a href="/connexion" className="hover:text-white transition-colors">
                Mon compte
              </a>
            </li>
          </ul>
        </div>

        {/* Infos pratiques */}
        <div>
          <h4 className="font-semibold text-sm tracking-widest uppercase mb-5" style={{ color: "#DFF057" }}>
            Infos pratiques
          </h4>
          <ul className="space-y-3 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            <li className="flex items-center gap-2">
              <Clock size={14} style={{ color: "#DFF057" }} />
              Lun. – Dim. : 7h – 15h
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={14} style={{ color: "#DFF057" }} />
              Alpes-Maritimes
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} style={{ color: "#DFF057" }} />
              <a href="mailto:contact@breakfast-time.fr" className="hover:text-white transition-colors">
                contact@breakfast-time.fr
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold text-sm tracking-widest uppercase mb-5" style={{ color: "#DFF057" }}>
            Newsletter
          </h4>

          {status === "success" ? (
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-2" style={{ color: "#DFF057" }}>
                <CheckCircle size={18} />
                <span className="text-sm font-semibold">Inscription confirmée !</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                Bienvenue dans la famille Breakfast Time ☀️ Un email de confirmation vient de vous être envoyé.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
                Recevez nos nouveautés et offres exclusives.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                  placeholder="votre@email.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/10 border border-white/20 placeholder:text-white/30 focus:outline-none focus:border-primary"
                  style={{ color: "white", borderColor: status === "error" ? "#ff6b6b" : undefined }}
                />
                {status === "error" && (
                  <p className="text-xs" style={{ color: "#ff9999" }}>
                    Une erreur est survenue, veuillez réessayer.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Inscription…
                    </>
                  ) : (
                    "S'abonner"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>

    {/* Bas de page */}
    <div className="border-t px-6 py-6" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      <div
        className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        <p>© 2026 Breakfast Time. Tous droits réservés.</p>
        <div className="flex gap-6">
          <a href="/mentions-legales" className="hover:text-white transition-colors">
            Mentions légales
          </a>
          <a href="/cgv" className="hover:text-white transition-colors">
            CGV
          </a>
          <a href="/confidentialite" className="hover:text-white transition-colors">
            Confidentialité
          </a>
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
