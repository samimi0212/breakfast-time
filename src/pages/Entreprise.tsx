import { useNavigate } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useLangPath } from "@/hooks/useLangPath";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Sparkles,
  Briefcase,
  Users,
  Clock,
  MapPin,
  Check,
  Coffee,
  Utensils,
  Cookie,
  Truck,
  ShieldCheck,
  Leaf,
  Phone,
  FileText,
  Calendar,
  Building2,
  Presentation,
  HandshakeIcon,
  GraduationCap,
  PartyPopper,
} from "lucide-react";
import brunchEntreprise from "@/assets/brunch-entreprise.webp";
import heroImg from "@/assets/image-accueil.webp";

const villesPhares = ["Nice", "Cannes", "Antibes", "Monaco", "Sophia Antipolis", "Grasse", "Mougins"];

const villesCompletes = [
  "Nice", "Cannes", "Antibes", "Monaco", "Sophia Antipolis", "Grasse", "Mougins",
  "Cagnes-sur-Mer", "Saint-Laurent-du-Var", "Villeneuve-Loubet", "Vallauris - Golfe-Juan",
  "Le Cannet", "Valbonne", "Juan-les-Pins", "Biot", "Menton", "Mandelieu-la-Napoule",
  "Théoule-sur-Mer", "Villefranche-sur-Mer", "Beaulieu-sur-Mer", "Saint-Jean-Cap-Ferrat",
  "Èze", "Cap-d'Ail",
];

const occasions = [
  { icon: Presentation, title: "Séminaires", desc: "Journées d'étude, kick-offs, conventions internes. Pauses gourmandes cadencées avec vos plénières." },
  { icon: Users, title: "Réunions & COMEX", desc: "Petit-déjeuner d'accueil pour vos réunions stratégiques, COMEX ou boards du matin." },
  { icon: HandshakeIcon, title: "Rendez-vous clients", desc: "Impressionnez vos prospects avec un accueil soigné, café d'exception et viennoiseries fraîches." },
  { icon: GraduationCap, title: "Formations", desc: "Pause du matin et goûter d'après-midi pour maintenir l'énergie de vos apprenants." },
  { icon: Building2, title: "Inaugurations & lancements", desc: "Événements presse, portes ouvertes, lancement produit : buffet raffiné et logistique clé en main." },
  { icon: PartyPopper, title: "Team building & afterworks", desc: "Célébrez vos succès d'équipe avec un brunch convivial ou un goûter cocooning." },
];

const formules = [
  {
    icon: Coffee,
    title: "Petit-déjeuner d'entreprise",
    price: "dès 9€ / pers.",
    desc: "Café bar, thés, jus pressés, viennoiseries pur beurre, fruits frais de saison, yaourts et granola.",
    tags: ["Horaires adaptés à votre demande", "Installation incluse", "Vaisselle biodégradable"],
  },
  {
    icon: Utensils,
    title: "Brunch d'entreprise",
    price: "dès 18€ / pers.",
    desc: "Formule complète sucrée & salée : œufs brouillés, bagels, avocado toast, saumon fumé, plateaux de fromages.",
    tags: ["Chef sur place possible", "Options végé & gluten-free", "Buffet ou plateaux individuels"],
  },
  {
    icon: Cookie,
    title: "Goûter d'entreprise",
    price: "dès 7€ / pers.",
    desc: "Pause sucrée d'après-midi : cookies, brownies, cakes maison, boissons chaudes et smoothies frais.",
    tags: ["Horaires adaptés à votre demande", "Idéal formation", "Format individuel disponible"],
  },
];

const guarantees = [
  { icon: Clock, title: "Ponctualité garantie", desc: "Livraison à l'heure précise convenue, sans exception. Nous arrivons à l'avance pour l'installation." },
  { icon: Leaf, title: "Frais et local", desc: "Ingrédients frais du matin, producteurs des Alpes-Maritimes, viennoiseries pur beurre AOP." },
  { icon: Truck, title: "Logistique clé en main", desc: "Livraison, installation, service, dressage, débarrassage : nous gérons tout." },
  { icon: ShieldCheck, title: "Facturation entreprise", desc: "Devis, bons de commande, facturation groupée, paiement par virement ou CB." },
];

const steps = [
  { num: "01", title: "Demandez un devis", desc: "Envoyez-nous votre brief : date, effectif, horaires, formule souhaitée. Réponse sous 2h ouvrées." },
  { num: "02", title: "Validez votre menu", desc: "Nous adaptons la sélection à vos contraintes : allergies, régimes, budget, timing." },
  { num: "03", title: "Nous livrons & installons", desc: "Le jour J, notre équipe arrive, installe et dresse. Vous n'avez qu'à profiter." },
];

const faqs = [
  { q: "Quel délai pour commander un petit-déjeuner d'entreprise ?", a: "Nous acceptons les commandes jusqu'à 48h avant. Pour les demandes urgentes (moins de 24h), contactez-nous, nous ferons notre maximum." },
  {
    q: "Livrez-vous dans toute la Côte d'Azur, y compris Monaco ?",
    a: `Oui, nous livrons dans l'ensemble des Alpes-Maritimes et à Monaco : ${villesCompletes.join(", ")} et communes alentours. Livraison possible 7j/7.`,
  },
  { q: "Gérez-vous les régimes spécifiques ?", a: "Oui : végétarien, vegan, sans gluten, sans lactose, halal. Précisez-nous les besoins lors du devis, nous adaptons la composition." },
  { q: "Proposez-vous un contrat cadre pour livraisons récurrentes ?", a: "Absolument. Pour les entreprises souhaitant un petit-déjeuner hebdomadaire ou mensuel, nous proposons des contrats avec tarifs préférentiels." },
  { q: "À partir de combien de personnes livrez-vous ?", a: "Nos formules événementielles démarrent à partir de 8 personnes. Pour les petits comités, notre carte classique reste disponible sans minimum." },
];

const Entreprise = () => {
  const navigate = useNavigate();
  const { lp } = useLangPath();

  usePageMeta(
    "Petit-déjeuner d'entreprise & brunch séminaire livré | Breakfast Time",
    "Petit-déjeuner, brunch & goûter livrés pour vos événements d'entreprise à Nice, Cannes, Antibes, Monaco et dans toutes les Alpes-Maritimes. Devis en 2h.",
    "/entreprise"
  );

  return (
    <>
      <Navbar />

      {/* JSON-LD Service */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Livraison de petit-déjeuner et brunch pour entreprises",
            provider: {
              "@type": "LocalBusiness",
              name: "Breakfast Time",
              areaServed: "Alpes-Maritimes",
              url: "https://www.breakfast-time.fr/entreprise",
            },
            areaServed: villesCompletes,
            description:
              "Livraison de petits-déjeuners, brunchs et goûters clé en main pour séminaires, réunions, formations et événements d'entreprise dans les Alpes-Maritimes et à Monaco.",
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "EUR",
              lowPrice: "7",
              highPrice: "25",
            },
          }),
        }}
      />

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <img src={heroImg} alt="Petit-déjeuner d'entreprise livré" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsla(61, 45%, 12%, 0.85) 0%, hsla(30, 10%, 8%, 0.75) 100%)" }} />
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
            style={{
              backgroundColor: "rgba(223, 240, 87, 0.15)",
              border: "1px solid rgba(223, 240, 87, 0.4)",
              color: "#DFF057",
            }}
          >
            <Briefcase size={11} />
            Solution entreprises · Alpes-Maritimes & Monaco
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6 text-white">
            Petit-déjeuner, brunch & goûter{" "}
            <span className="italic" style={{ color: "#DFF057" }}>pour vos événements d'entreprise</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.8)" }}>
            Séminaires, réunions, formations, présentations, inaugurations : nous livrons, installons et dressons votre buffet gourmand à {villesPhares.slice(0, 4).join(", ")} et partout dans les Alpes-Maritimes. Vous vous concentrez sur l'essentiel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(lp("/evenements/commander"))}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-bold transition-all hover:scale-105"
              style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
            >
              <FileText size={18} /> Obtenir un devis gratuit
            </button>
            <button
              onClick={() => navigate(lp("/contact"))}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold border-2 transition-colors hover:bg-white/10 text-white"
              style={{ borderColor: "rgba(255,255,255,0.3)" }}
            >
              <Phone size={18} /> Nous contacter
            </button>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
            <span className="flex items-center gap-2"><Check size={14} style={{ color: "#DFF057" }} /> Devis sous 2h</span>
            <span className="flex items-center gap-2"><Check size={14} style={{ color: "#DFF057" }} /> Livraison 7j/7</span>
            <span className="flex items-center gap-2"><Check size={14} style={{ color: "#DFF057" }} /> Facturation entreprise</span>
            <span className="flex items-center gap-2"><Check size={14} style={{ color: "#DFF057" }} /> Installation incluse</span>
          </div>
        </div>
      </section>

      {/* Intro SEO */}
      <section className="py-20 px-6" style={{ backgroundColor: "#f4f1ea" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: "#7a7020" }}>
            Votre partenaire petit-déjeuner professionnel
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: "#2a2a08" }}>
            La pause gourmande qui donne le ton à vos événements
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: "#4a4a2a" }}>
            Depuis notre atelier des Alpes-Maritimes, <strong>Breakfast Time</strong> livre chaque jour les entreprises
            et agences événementielles de la région, de <strong>{villesPhares.slice(0, 3).join(", ")}</strong> à{" "}
            <strong>Monaco</strong>, en passant par <strong>{villesPhares.slice(4).join(" et ")}</strong>.
            Petits-déjeuners d'équipe, brunchs de séminaire, goûters de formation : nous concevons des formules sur mesure,
            préparées le matin même avec des produits frais et locaux, et livrées installées à l'heure précise dans vos bureaux,
            salles de réunion ou lieux d'événement.
          </p>
        </div>
      </section>

      {/* Occasions */}
      <section className="py-24 px-6" style={{ backgroundColor: "white" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4" style={{ backgroundColor: "rgba(58,58,10,0.08)", color: "#5a5a1a" }}>
              <Sparkles size={11} /> Pour chaque occasion pro
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4" style={{ color: "#2a2a08" }}>
              Tous vos moments d'entreprise
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "#6a6a4a" }}>
              Une formule adaptée à chaque format, du café d'accueil aux séminaires de plusieurs jours.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {occasions.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-8 rounded-2xl transition-all hover:-translate-y-1" style={{ backgroundColor: "#f4f1ea", boxShadow: "var(--card-shadow)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: "#DFF057" }}>
                  <Icon size={22} style={{ color: "#3a3a0a" }} />
                </div>
                <h3 className="font-display text-xl font-bold mb-2" style={{ color: "#2a2a08" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6a6a4a" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formules */}
      <section className="py-24 px-6" style={{ backgroundColor: "#f4f1ea" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4" style={{ color: "#2a2a08" }}>
              Exemples de formules entreprise
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "#6a6a4a" }}>
              Trois exemples pour vous inspirer — chaque formule est personnalisable et nous nous adaptons aux horaires et contraintes de votre événement.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {formules.map(({ icon: Icon, title, price, desc, tags }) => (
              <div key={title} className="p-8 rounded-2xl flex flex-col" style={{ backgroundColor: "white", boxShadow: "var(--card-shadow)" }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: "rgba(223, 240, 87, 0.3)" }}>
                  <Icon size={26} style={{ color: "#3a3a0a" }} />
                </div>
                <h3 className="font-display text-2xl font-bold mb-1" style={{ color: "#2a2a08" }}>{title}</h3>
                <p className="text-sm font-bold mb-4" style={{ color: "#7a7020" }}>{price}</p>
                <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: "#6a6a4a" }}>{desc}</p>
                <ul className="space-y-2 mb-6">
                  {tags.map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm" style={{ color: "#3a3a0a" }}>
                      <Check size={14} style={{ color: "#7a7020" }} /> {t}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate(lp("/evenements/commander"))}
                  className="w-full py-3 rounded-full font-semibold text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#3a3a0a", color: "#DFF057" }}
                >
                  Demander un devis
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-24 px-6" style={{ backgroundColor: "white" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: "#7a7020" }}>3 étapes simples</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold" style={{ color: "#2a2a08" }}>Comment ça marche</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="text-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 font-display text-xl font-bold"
                  style={{ backgroundColor: "#3a3a0a", color: "#DFF057" }}
                >
                  {num}
                </div>
                <h3 className="font-display text-xl font-bold mb-3" style={{ color: "#2a2a08" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6a6a4a" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Garanties */}
      <section className="py-24 px-6" style={{ backgroundColor: "#2a2a08", color: "white" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Pourquoi les entreprises nous choisissent
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
              Une prestation professionnelle, sans mauvaise surprise.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {guarantees.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "rgba(223, 240, 87, 0.15)" }}>
                  <Icon size={24} style={{ color: "#DFF057" }} />
                </div>
                <h3 className="font-display text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zone */}
      <section className="py-20 px-6" style={{ backgroundColor: "#f4f1ea" }}>
        <div className="max-w-4xl mx-auto text-center">
          <MapPin size={32} className="mx-auto mb-4" style={{ color: "#7a7020" }} />
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: "#2a2a08" }}>
            Livraison dans toutes les Alpes-Maritimes et à Monaco
          </h2>
          <p className="text-xl font-semibold mb-4" style={{ color: "#2a2a08" }}>
            {villesPhares.join(" · ")}
          </p>
          <p className="text-base mb-8" style={{ color: "#4a4a2a" }}>
            {villesCompletes.filter((v) => !villesPhares.includes(v)).join(" · ")}
          </p>
          <p className="text-sm" style={{ color: "#6a6a4a" }}>
            Une adresse hors zone ? Contactez-nous, nous étudions chaque demande.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6" style={{ backgroundColor: "white" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4" style={{ color: "#2a2a08" }}>Questions fréquentes</h2>
            <p className="text-lg" style={{ color: "#6a6a4a" }}>Tout ce que les entreprises nous demandent.</p>
          </div>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group rounded-2xl p-6 cursor-pointer" style={{ backgroundColor: "#f4f1ea" }}>
                <summary className="font-display text-lg font-semibold flex justify-between items-center list-none" style={{ color: "#2a2a08" }}>
                  {q}
                  <span className="text-2xl transition-transform group-open:rotate-45" style={{ color: "#7a7020" }}>+</span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed" style={{ color: "#4a4a2a" }}>{a}</p>
              </details>
            ))}
          </div>

          {/* JSON-LD FAQ */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqs.map(({ q, a }) => ({
                  "@type": "Question",
                  name: q,
                  acceptedAnswer: { "@type": "Answer", text: a },
                })),
              }),
            }}
          />
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 px-6 relative overflow-hidden">
        <img src={brunchEntreprise} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsla(61, 45%, 12%, 0.9) 0%, hsla(30, 10%, 8%, 0.85) 100%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <Calendar size={32} className="mx-auto mb-5" style={{ color: "#DFF057" }} />
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-5">
            Prêts à régaler votre prochaine équipe ?
          </h2>
          <p className="text-lg mb-10" style={{ color: "rgba(255,255,255,0.75)" }}>
            Réponse à votre devis sous 2h ouvrées, avec proposition personnalisée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(lp("/evenements/commander"))}
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full text-base font-bold transition-all hover:scale-105"
              style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
            >
              <FileText size={18} /> Demander mon devis
            </button>
            <button
              onClick={() => navigate(lp("/contact"))}
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full text-base font-semibold border-2 text-white transition-colors hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.3)" }}
            >
              <Phone size={18} /> Nous contacter
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Entreprise;
