import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventBookingForm from "@/components/EventBookingForm";
import PhoneAppointmentForm from "@/components/PhoneAppointmentForm";
import {
  Heart,
  Check,
  Sparkles,
  Clock,
  Users,
  Truck,
  Leaf,
  ChefHat,
  ArrowRight,
  Plus,
  Minus,
  MapPin,
  ShoppingBag,
  FileText,
  Phone,
  X,
} from "lucide-react";
import heroMariage from "@/assets/mariage-hero.webp";
import buffetMariage from "@/assets/mariage-buffet.webp";
import convivesMariage from "@/assets/mariage-convives.webp";
import detailMariage from "@/assets/mariage-hero.webp";

const OLIVE_DARK = "#2a2a08";
const OLIVE_MID = "#7a7020";
const OLIVE_SOFT = "#8a8a60";
const LIME = "#DFF057";
const CREAM = "#f4f1ea";

const formules = [
  {
    name: "Essentiel",
    price: "12€",
    tagline: "L'élégance simple",
    items: [
      "Viennoiseries pur beurre",
      "Corbeille de fruits frais de saison",
      "Jus d'orange pressé & eaux",
      "Café en grains & thés premium",
      "Vaisselle jetable haut de gamme",
    ],
  },
  {
    name: "Signature",
    price: "18€",
    tagline: "Notre formule la plus choisie",
    highlight: true,
    items: [
      "Tout l'Essentiel",
      "Plateau salé : mini-quiches, croque-monsieur, wraps",
      "Bar à granolas & yaourts fermiers",
      "Pâtisseries signature & mignardises",
      "Décoration florale & scénographie du buffet",
      "Vaisselle porcelaine & couverts dorés",
    ],
  },
  {
    name: "Prestige",
    price: "29€",
    tagline: "L'expérience complète",
    items: [
      "Tout le Signature",
      "Bar à œufs & pancakes en live cooking",
      "Saumon fumé, burrata & planches de charcuterie fine",
      "Bar à mimosas & jus détox",
      "Wedding cake de viennoiseries",
      "Maîtres d'hôtel sur place (2 à 4 pers.)",
    ],
  },
];

const moments = [
  {
    title: "Le brunch du lendemain",
    text: "Le rendez-vous incontournable pour prolonger la fête en douceur avec vos proches, au domaine ou à la villa.",
    image: convivesMariage,
  },
  {
    title: "Le welcome breakfast",
    text: "Accueillez vos invités venus de loin avec un petit-déjeuner raffiné le matin de la cérémonie.",
    image: buffetMariage,
  },
  {
    title: "Le brunch-cérémonie",
    text: "Un mariage entièrement pensé autour d'un brunch : lumineux, gourmand, chaleureux et 100 % à votre image.",
    image: detailMariage,
  },
];

const inclus = [
  { icon: Truck, title: "Livraison & installation", text: "Buffet dressé et scénographié avant l'arrivée de vos invités." },
  { icon: ChefHat, title: "Produits faits maison", text: "Viennoiseries et pâtisseries préparées le matin même." },
  { icon: Leaf, title: "Produits locaux", text: "Fruits, fromages et jus sourcés dans les Alpes-Maritimes." },
  { icon: Users, title: "Équipe dédiée", text: "Un interlocuteur unique du devis au débarrassage." },
  { icon: Clock, title: "Ponctualité garantie", text: "Créneau confirmé 48 h avant le jour J." },
  { icon: Sparkles, title: "Sur-mesure", text: "Palette, fleurs et menu adaptés à votre thème." },
];

const etapes = [
  { n: "01", title: "Échange", text: "On parle de votre lieu, votre date, votre nombre d'invités." },
  { n: "02", title: "Devis & dégustation", text: "Proposition détaillée sous 24 h, dégustation offerte dès 60 convives." },
  { n: "03", title: "Personnalisation", text: "On affine menu, décor et timing jusqu'au moindre détail." },
  { n: "04", title: "Le jour J", text: "On installe, on sert, on débarrasse. Vous profitez." },
];

const faq = [
  {
    q: "Combien de temps à l'avance faut-il réserver ?",
    a: "Nous recommandons 2 à 3 mois pour un mariage, et jusqu'à 6 mois en haute saison (mai à septembre). Nous étudions aussi les demandes de dernière minute selon nos disponibilités.",
  },
  {
    q: "Intervenez-vous dans tous les lieux de réception ?",
    a: "Oui : domaines, villas privées, plages privées, hôtels et salles des Alpes-Maritimes et du Var Est. Nous sommes autonomes en matériel et n'avons pas besoin de cuisine sur place.",
  },
  {
    q: "Gérez-vous les régimes alimentaires particuliers ?",
    a: "Absolument. Options végétariennes, vegan, sans gluten, sans lactose et halal disponibles sur simple demande, sans supplément sur la formule.",
  },
  {
    q: "Y a-t-il un nombre minimum d'invités ?",
    a: "Nos formules mariage démarrent à 20 convives. En dessous, nous vous orientons vers nos plateaux brunch groupe.",
  },
  {
    q: "La décoration du buffet est-elle incluse ?",
    a: "La scénographie du buffet (nappage, présentoirs, verdure) est incluse dès la formule Signature. Les compositions florales sur-mesure sont proposées en option.",
  },
];

const BrunchMariage = () => {
  usePageMeta(
    "Brunch Mariage — Traiteur brunch de mariage | Breakfast Time",
    "Traiteur brunch de mariage dans les Alpes-Maritimes : buffet raffiné, décoration sur-mesure, installation et service inclus. À partir de 12€/pers. Devis en 24h.",
    "/brunch-mariage"
  );
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showAppointment, setShowAppointment] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Brunch de mariage",
            serviceType: "Traiteur brunch mariage",
            provider: { "@type": "LocalBusiness", name: "Breakfast Time", areaServed: "Alpes-Maritimes" },
            offers: { "@type": "Offer", price: "12", priceCurrency: "EUR" },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map(({ q, a }) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />

      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-end overflow-hidden">
        <img
          src={heroMariage}
          alt="Table de brunch de mariage dressée en extérieur avec viennoiseries et branches d'olivier"
          width={1920}
          height={1280}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(20,20,6,0.45) 0%, rgba(20,20,6,0.15) 40%, rgba(20,20,6,0.85) 100%)" }}
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 pt-32">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-7"
            style={{ backgroundColor: "rgba(223,240,87,0.14)", border: "1px solid rgba(223,240,87,0.4)", color: LIME }}
          >
            <Heart size={11} />
            Traiteur brunch de mariage · Alpes-Maritimes
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] max-w-3xl text-white mb-6">
            Le plus beau jour
            <br />
            commence par un{" "}
            <span className="italic" style={{ color: LIME }}>
              brunch
            </span>
          </h1>

          <p className="text-base md:text-xl max-w-xl leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.78)" }}>
            Buffets raffinés, scénographie sur-mesure et service attentionné pour votre mariage.
            Installation incluse, de 20 à 300 convives.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#devis"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-bold transition-transform hover:scale-105"
              style={{ backgroundColor: LIME, color: "#3a3a0a" }}
            >
              Demander un devis gratuit <ArrowRight size={16} />
            </a>
            <button
              onClick={() => navigate("/evenements/commander")}
              className="inline-flex items-center justify-center gap-2 border-2 px-8 py-4 rounded-full text-base font-semibold text-white transition-colors hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.35)" }}
            >
              <ShoppingBag size={16} /> Composer mon brunch
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 pt-8 border-t" style={{ borderColor: "rgba(255,255,255,0.18)" }}>
            {[
              ["12€", "par personne"],
              ["300", "convives max"],
              ["24h", "réponse devis"],
              ["7j/7", "disponibilité"],
            ].map(([big, small]) => (
              <div key={small}>
                <p className="font-display text-3xl md:text-4xl font-bold" style={{ color: LIME }}>
                  {big}
                </p>
                <p className="text-xs uppercase tracking-widest mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {small}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTRO ÉDITORIALE */}
      <section className="py-24 px-6 md:px-12 lg:px-20" style={{ backgroundColor: CREAM }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <img
            src={detailMariage}
            alt="Assiette de mariage dressée avec branche d'olivier et marque-place calligraphié"
            loading="lazy"
            width={1200}
            height={1200}
            className="w-full rounded-3xl object-cover"
            style={{ aspectRatio: "4/5", boxShadow: "var(--card-shadow-hover)" }}
          />

          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: OLIVE_MID }}>
              Notre approche
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-6" style={{ color: OLIVE_DARK }}>
              Un brunch qui vous <span className="italic" style={{ color: OLIVE_MID }}>ressemble</span>
            </h2>
            <p className="text-base md:text-lg leading-relaxed mb-5" style={{ color: "#4a4a2a" }}>
              Nous ne dupliquons pas un buffet standard. Chaque mariage démarre par un échange sur votre
              lieu, votre palette de couleurs, vos invités et ce que vous aimez manger.
            </p>
            <p className="text-base leading-relaxed mb-8" style={{ color: OLIVE_SOFT }}>
              Viennoiseries pur beurre sorties du four le matin même, fruits de producteurs voisins,
              café de spécialité, et une présentation pensée comme un décor : nappage naturel, verdure
              fraîche, présentoirs en céramique et bois.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Fait maison", "Producteurs locaux", "Zéro plastique", "Options vegan & sans gluten"].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: "rgba(58,58,10,0.07)", color: "#5a5a1a" }}
                >
                  <Check size={12} /> {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MOMENTS */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-xl mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: OLIVE_MID }}>
              Trois façons de célébrer
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight" style={{ color: OLIVE_DARK }}>
              Quel brunch pour votre mariage&nbsp;?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {moments.map(({ title, text, image }, i) => (
              <div
                key={title}
                className="group rounded-3xl overflow-hidden bg-card hover-lift"
                style={{ boxShadow: "var(--card-shadow)" }}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                  <img
                    src={image}
                    alt={title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span
                    className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: LIME, color: "#3a3a0a" }}
                  >
                    {i + 1}
                  </span>
                </div>
                <div className="p-7">
                  <h3 className="font-display text-xl font-bold mb-2.5" style={{ color: OLIVE_DARK }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: OLIVE_SOFT }}>
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULES */}
      <section className="py-24 px-6 md:px-12 lg:px-20" style={{ backgroundColor: CREAM }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: OLIVE_MID }}>
              Nos formules mariage
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: OLIVE_DARK }}>
              Des prix clairs, sans surprise
            </h2>
            <p className="text-sm" style={{ color: OLIVE_SOFT }}>
              Tarifs par personne · Livraison, installation et débarrassage inclus · Dès 20 convives
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {formules.map(({ name, price, tagline, items, highlight }) => (
              <div
                key={name}
                className="relative rounded-3xl p-8 h-full flex flex-col hover-lift"
                style={{
                  backgroundColor: highlight ? OLIVE_DARK : "white",
                  boxShadow: highlight ? "var(--card-shadow-hover)" : "var(--card-shadow)",
                  border: highlight ? `1px solid ${LIME}` : "1px solid rgba(58,58,10,0.07)",
                }}
              >
                {highlight && (
                  <span
                    className="absolute -top-3 left-8 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase"
                    style={{ backgroundColor: LIME, color: "#3a3a0a" }}
                  >
                    Le plus demandé
                  </span>
                )}
                <p
                  className="text-xs font-semibold tracking-widest uppercase mb-3"
                  style={{ color: highlight ? "rgba(223,240,87,0.8)" : OLIVE_MID }}
                >
                  {tagline}
                </p>
                <h3 className="font-display text-2xl font-bold mb-4" style={{ color: highlight ? "white" : OLIVE_DARK }}>
                  {name}
                </h3>
                <div className="flex items-baseline gap-1.5 mb-7">
                  <span className="font-display text-4xl font-bold" style={{ color: highlight ? LIME : OLIVE_DARK }}>
                    {price}
                  </span>
                  <span className="text-sm" style={{ color: highlight ? "rgba(255,255,255,0.55)" : OLIVE_SOFT }}>
                    / personne
                  </span>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {items.map((it) => (
                    <li key={it} className="flex gap-2.5 text-sm leading-snug">
                      <Check size={15} className="flex-shrink-0 mt-0.5" style={{ color: highlight ? LIME : OLIVE_MID }} />
                      <span style={{ color: highlight ? "rgba(255,255,255,0.82)" : "#4a4a2a" }}>{it}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#devis"
                  className="block text-center px-6 py-3.5 rounded-full text-sm font-bold transition-transform hover:scale-[1.03]"
                  style={highlight ? { backgroundColor: LIME, color: "#3a3a0a" } : { backgroundColor: "rgba(58,58,10,0.06)", color: OLIVE_DARK }}
                >
                  Demander cette formule
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INCLUS */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: OLIVE_MID }}>
              Tout est prévu
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight" style={{ color: OLIVE_DARK }}>
              Ce qui est inclus
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {inclus.map(({ icon: Icon, title, text }) => (
              <div key={title} className="p-7 rounded-2xl" style={{ backgroundColor: CREAM }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(223,240,87,0.35)" }}>
                  <Icon size={20} style={{ color: OLIVE_DARK }} />
                </div>
                <h3 className="font-display text-lg font-bold mb-2" style={{ color: OLIVE_DARK }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: OLIVE_SOFT }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÉTAPES */}
      <section className="py-24 px-6 md:px-12 lg:px-20" style={{ backgroundColor: OLIVE_DARK }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: LIME }}>
              De l'échange au jour J
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight text-white">
              Comment ça se passe
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {etapes.map(({ n, title, text }, i) => (
              <div key={n} className="relative">
                <p className="font-display text-2xl font-bold mb-3" style={{ color: LIME }}>
                  {n}
                </p>
                <h3 className="font-display text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {text}
                </p>
                {i < etapes.length - 1 && (
                  <div className="hidden lg:block absolute top-3 -right-4 w-8 h-px" style={{ backgroundColor: "rgba(223,240,87,0.3)" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ZONE */}
      <section className="py-20 px-6 md:px-12 lg:px-20 bg-background">
        <div
          className="max-w-7xl mx-auto rounded-3xl p-9 md:p-12 flex flex-col md:flex-row md:items-center gap-8"
          style={{ backgroundColor: "rgba(223,240,87,0.18)" }}
        >
          <MapPin size={30} style={{ color: "#5a5a1a" }} className="flex-shrink-0" />
          <div className="flex-1">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-3" style={{ color: OLIVE_DARK }}>
              Nous livrons partout sur la Côte d'Azur
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#4a4a2a" }}>
              Nice · Cannes · Antibes · Mougins · Valbonne · Saint-Paul-de-Vence · Grasse · Villefranche ·
              Monaco · Menton · Saint-Tropez (sur devis)
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 md:px-12 lg:px-20" style={{ backgroundColor: CREAM }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-12 text-center" style={{ color: OLIVE_DARK }}>
            Questions fréquentes
          </h2>
          <div className="space-y-3">
            {faq.map(({ q, a }, i) => (
              <div key={q} className="rounded-2xl overflow-hidden bg-card" style={{ boxShadow: "var(--card-shadow)" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
                >
                  <span className="font-display text-base md:text-lg font-bold" style={{ color: OLIVE_DARK }}>
                    {q}
                  </span>
                  {openFaq === i ? (
                    <Minus size={18} style={{ color: OLIVE_MID }} className="flex-shrink-0" />
                  ) : (
                    <Plus size={18} style={{ color: OLIVE_MID }} className="flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <p className="px-6 pb-6 text-sm leading-relaxed" style={{ color: OLIVE_SOFT }}>
                    {a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEVIS */}
      <section id="devis" className="py-24 px-6 md:px-12 lg:px-20 bg-background scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-5"
              style={{ backgroundColor: "rgba(58,58,10,0.08)", color: "#5a5a1a" }}
            >
              <Heart size={11} /> Réponse en 24 h
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: OLIVE_DARK }}>
              Parlons de votre <span className="italic" style={{ color: OLIVE_MID }}>grand jour</span>
            </h2>
            <p className="text-sm" style={{ color: OLIVE_SOFT }}>
              Devis gratuit et sans engagement · Dégustation offerte dès 60 convives
            </p>
          </div>
          <EventBookingForm />
        </div>
      </section>

      <Footer />

      {/* Modal Prendre RDV */}
      {showAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto"
          onClick={() => setShowAppointment(false)}
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full my-8 p-8 relative" onClick={(e) => e.stopPropagation()}>
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
    </div>
  );
};

export default BrunchMariage;
