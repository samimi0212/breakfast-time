import { Instagram, Facebook, Mail, MapPin, Clock } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="bg-foreground" style={{ color: "hsl(var(--background))" }}>

    {/* Bandeau CTA */}
    <div className="border-b px-6 py-10" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-display text-2xl font-bold mb-1" style={{ color: "white" }}>
            Prêt à commander ?
          </h3>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            Livraison en 30 min · 7j/7 de 7h à 15h · Alpes-Maritimes
          </p>
        </div>
        <a
          href="/carte"
          className="flex-shrink-0 px-8 py-3.5 rounded-full font-semibold text-sm transition-all hover:scale-105"
          style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
        >
          Voir la carte →
        </a>
      </div>
    </div>

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
            
              href="#"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ backgroundColor: "rgba(223,240,87,0.15)" }}
            >
              <Instagram size={18} style={{ color: "#DFF057" }} />
            </a>
            
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
            <li><a href="/carte" className="hover:text-white transition-colors">La Carte</a></li>
            <li><a href="/#how" className="hover:text-white transition-colors">Comment ça marche</a></li>
            <li><a href="/#about" className="hover:text-white transition-colors">À propos</a></li>
            <li><a href="/#delivery" className="hover:text-white transition-colors">Zone de livraison</a></li>
            <li><a href="/connexion" className="hover:text-white transition-colors">Mon compte</a></li>
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
              <a href="mailto:hello@breakfast-time.fr" className="hover:text-white transition-colors">
                hello@breakfast-time.fr
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold text-sm tracking-widest uppercase mb-5" style={{ color: "#DFF057" }}>
            Newsletter
          </h4>
          <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
            Recevez nos nouveautés et offres exclusives.
          </p>
          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="votre@email.com"
              className="w-full px-4 py-2.5 rounded-xl text-sm text-foreground bg-white/10 border border-white/20 placeholder:text-white/30 focus:outline-none focus:border-primary"
              style={{ color: "white" }}
            />
            <button
              className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
              style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
            >
              S'abonner
            </button>
          </div>
        </div>

      </div>
    </div>

    {/* Bas de page */}
    <div
      className="border-t px-6 py-6"
      style={{ borderColor: "rgba(255,255,255,0.08)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
        <p>© 2026 Breakfast Time. Tous droits réservés.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
          <a href="#" className="hover:text-white transition-colors">CGV</a>
          <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
        </div>
      </div>
    </div>

  </footer>
);

export default Footer;