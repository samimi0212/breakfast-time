import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventBookingForm from "@/components/EventBookingForm";
import PhoneAppointmentForm from "@/components/PhoneAppointmentForm";
import { Sparkles, Phone, FileText, X, Heart, Briefcase, Users, Check, ShoppingBag } from "lucide-react";
import brunchMariage from "@/assets/brunch-mariage.jpg";
import brunchEntreprise from "@/assets/brunch-entreprise.jpg";
import brunchGroupe from "@/assets/brunch-groupe.png";

const eventDetails = [
  {
    id: "mariage",
    name: "Brunch Mariage",
    price: "12€",
    image: brunchMariage,
    icon: Heart,
    accroche: "Le plus beau jour mérite un buffet d'exception",
    description:
      "Célébrez votre mariage avec un brunch raffiné. Buffet généreux, décoration personnalisable et service discret pour un moment inoubliable.",
    features: [
      "Buffet viennoiseries premium",
      "Sélection salé & sucré gourmande",
      "Boissons chaudes & froides",
      "Décoration & présentation soignée",
      "Service sur place professionnel",
    ],
  },
  {
    id: "entreprise",
    name: "Brunch Entreprise",
    price: "9€",
    image: brunchEntreprise,
    icon: Briefcase,
    accroche: "Boostez vos réunions et séminaires",
    description:
      "Une pause gourmande pour dynamiser vos équipes. Idéal pour réunions, séminaires, formations ou team building. Livraison & installation incluses.",
    features: [
      "Installation rapide sur site",
      "Formule adaptée à vos horaires",
      "Viennoiseries fraîches du matin",
      "Fruits & produits locaux",
      "Service ponctuel et discret",
    ],
  },
  {
    id: "groupe",
    name: "Brunch Groupe",
    price: "8€",
    image: brunchGroupe,
    icon: Users,
    accroche: "Tous vos moments de partage",
    description:
      "Anniversaire, enterrement de vie, retrouvailles entre amis ou en famille... Un brunch convivial et généreux pour des souvenirs mémorables.",
    features: [
      "Buffet viennoiseries & pains",
      "Plateaux sucré & salé",
      "Boissons fraîches variées",
      "Ambiance chaleureuse",
      "Décoration thématique possible",
    ],
  },
];

const Events = () => {
  usePageMeta(
    "Événements — Mariage, Entreprise, Groupe | Breakfast Time",
    "Breakfast Time organise vos petits-déjeuners d'exception pour mariages, séminaires et événements de groupe dans les Alpes-Maritimes.",
    "/evenements"
  );
  const navigate = useNavigate();
  const [showAppointment, setShowAppointment] = useState(false);
  const [showDevis, setShowDevis] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6 text-center" style={{ backgroundColor: "#f4f1ea" }}>
        <div className="max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
            style={{ backgroundColor: "rgba(58,58,10,0.08)", color: "#5a5a1a" }}
          >
            <Sparkles size={12} />
            Sur mesure pour chaque occasion
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-5 leading-tight" style={{ color: "#2a2a08" }}>
            Vos événements,{" "}
            <span className="italic" style={{ color: "#7a7020" }}>
              notre signature
            </span>
          </h1>
          <p className="text-base leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: "#5a5a40" }}>
            De l'intime au grand format, nous créons l'expérience gourmande qui vous ressemble — mariage, entreprise, anniversaire, EVJF et bien plus
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/carte")}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
            >
              <ShoppingBag size={16} />
              Commander en ligne
            </button>
            <button
              onClick={() => setShowAppointment(true)}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: "#3a3a0a", color: "#ffffff" }}
            >
              <Phone size={16} />
              Demande de rappel
            </button>
            <button
              onClick={() => setShowDevis(true)}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border-2 transition-colors hover:bg-black/5"
              style={{ borderColor: "rgba(58,58,10,0.25)", color: "#3a3a0a" }}
            >
              <FileText size={16} />
              Demander un devis
            </button>
          </div>
        </div>
      </div>

      {/* Events Sections - Alternating */}
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-32">
          {eventDetails.map((event, index) => {
            const Icon = event.icon;
            const isReversed = index % 2 === 1;

            return (
              <div
                key={event.id}
                className={`flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 items-center`}
              >
                {/* Image */}
                <div className="lg:w-1/2 w-full">
                  <div
                    className="relative aspect-square rounded-3xl overflow-hidden"
                    style={{ boxShadow: "0 30px 60px -12px rgba(0,0,0,0.15)" }}
                  >
                    <img src={event.image} alt={event.name} className="w-full h-full object-cover" loading="lazy" />
                    <div
                      className="absolute top-6 left-6 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md"
                      style={{ backgroundColor: "rgba(223, 240, 87, 0.95)", color: "#3a3a0a" }}
                    >
                      À partir de {event.price}/pers.
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:w-1/2 w-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-semibold tracking-widest uppercase text-primary">{event.accroche}</p>
                  </div>

                  <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    {event.name}
                  </h2>

                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{event.description}</p>

                  <div className="space-y-3 mb-10">
                    {event.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check size={12} className="text-primary" />
                        </div>
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => navigate("/carte")}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:scale-105"
                      style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
                    >
                      <ShoppingBag size={16} />
                      Commander en ligne
                    </button>
                    <button
                      onClick={() => setShowAppointment(true)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:scale-105"
                      style={{ backgroundColor: "#3a3a0a", color: "#ffffff" }}
                    >
                      <Phone size={16} />
                      Demande de rappel
                    </button>
                    <button
                      onClick={() => setShowDevis(true)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border-2 border-foreground/20 hover:bg-black/5 transition-colors"
                    >
                      <FileText size={16} />
                      Demander un devis
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final CTA */}
      <div
        className="relative py-20 px-6 overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(61, 45%, 20%) 0%, hsl(30, 10%, 8%) 100%)" }}
      >
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6" style={{ color: "white" }}>
            Un projet en tête ?{" "}
            <span className="italic" style={{ color: "#DFF057" }}>
              Parlons-en
            </span>
          </h2>
          <p className="text-lg mb-10" style={{ color: "rgba(255,255,255,0.75)" }}>
            Notre équipe vous accompagne de A à Z pour faire de votre événement un moment unique.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/carte")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
            >
              <ShoppingBag size={18} />
              Commander en ligne
            </button>
            <button
              onClick={() => setShowAppointment(true)}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "white", border: "2px solid rgba(255,255,255,0.3)" }}
            >
              <Phone size={18} />
              Demande de rappel
            </button>
            <button
              onClick={() => setShowDevis(true)}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold border-2 transition-colors hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}
            >
              <FileText size={18} />
              Demander un devis
            </button>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modal Prendre RDV */}
      {showAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto"
          onClick={() => setShowAppointment(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full my-8 p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAppointment(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X size={20} />
            </button>
            <PhoneAppointmentForm onClose={() => setShowAppointment(false)} />
          </div>
        </div>
      )}

      {/* Modal Demander un devis */}
      {showDevis && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto"
          onClick={() => setShowDevis(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full my-8 p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDevis(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors z-10"
            >
              <X size={20} />
            </button>
            <h2 className="font-display text-3xl font-bold text-center mb-3">Demander un devis</h2>
            <p className="text-center text-muted-foreground mb-8">
              Remplissez le formulaire et nous vous proposerons une formule adaptée.
            </p>
            <EventBookingForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
