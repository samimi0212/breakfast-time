import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useLangPath } from "@/hooks/useLangPath";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DeliveryZone from "@/components/DeliveryZone";
import NotFound from "./NotFound";
import { getCityBySlug, cities } from "@/data/cities";
import {
  MapPin,
  Clock,
  Check,
  ArrowRight,
  Truck,
  Languages,
  Star,
  Building2,
  Utensils,
  Coffee,
  Croissant,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroImg from "@/assets/image-accueil.png";
import contextImg from "@/assets/image-accueil2.png";
import brunchEntrepriseImg from "@/assets/brunch-entreprise.jpg";
import pancakesPartagerImg from "@/assets/brunch.png";
import menuAnglaisImg from "@/assets/entreprise.jpg";

interface VillePageProps {
  slug: string;
}

const VillePage = ({ slug }: VillePageProps) => {
  const city = getCityBySlug(slug);
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { lp } = useLangPath();
  const isEn = i18n.language === "en";

  const path = `/livraison-petit-dejeuner-${slug}`;

  usePageMeta(
    city ? (isEn ? city.metaTitle_en : city.metaTitle) : "Page introuvable | Breakfast Time",
    city ? (isEn ? city.metaDesc_en : city.metaDesc) : "",
    path
  );

  // Schema JSON-LD : FAQPage (aide à l'affichage enrichi dans Google).
  useEffect(() => {
    if (!city) return;
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: city.faq.map((f) => ({
        "@type": "Question",
        name: isEn ? f.q_en : f.q,
        acceptedAnswer: { "@type": "Answer", text: isEn ? f.a_en : f.a },
      })),
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-ville-faq", slug);
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);
    return () => {
      document.head.querySelectorAll(`script[data-ville-faq="${slug}"]`).forEach((el) => el.remove());
    };
  }, [city, slug, isEn]);

  if (!city) return <NotFound />;

  const intro = isEn ? city.intro_en : city.intro;
  const context = isEn ? city.context_en : city.context;
  const deliveryTime = isEn ? city.deliveryTime_en : city.deliveryTime;
  const otherCities = cities.filter((c) => c.slug !== slug);
  const preposition = city.preposition ?? "à";
  const nameAfterPreposition = city.preposition ? (city.shortName ?? city.name) : city.name;

  const tr = (fr: string, en: string) => (isEn ? en : fr);

  const heroOverlay = "linear-gradient(135deg, rgba(44, 44, 17, 0.88) 0%, rgba(22, 20, 18, 0.78) 100%)";
  const ctaOverlay = "linear-gradient(135deg, rgba(44, 44, 17, 0.9) 0%, rgba(22, 20, 18, 0.82) 100%)";

  const stats = [
    { icon: Clock, value: deliveryTime, label: tr("Délai moyen de livraison", "Average delivery time") },
    { icon: Truck, value: "7j/7 · 8h-15h", label: `${tr("Livraison à", "Delivery in")} ${nameAfterPreposition}` },
    { icon: Languages, value: "FR / EN", label: tr("Service bilingue", "Bilingual service") },
    { icon: Star, value: "4,9/5", label: tr("Satisfaction clients", "Customer satisfaction") },
  ];

  const occasionCards = [
    { icon: Building2, img: brunchEntrepriseImg, product: tr("Plateau petit-déjeuner", "Breakfast platter"), ctaLabel: tr("Demander un devis", "Request a quote"), to: "/contact" },
    { icon: Utensils, img: pancakesPartagerImg, product: tr("Pancakes à partager", "Pancakes to share"), ctaLabel: tr("Voir la carte", "See the menu"), to: "/carte" },
    { icon: Coffee, img: menuAnglaisImg, product: tr("Menu Anglais", "English Menu"), ctaLabel: tr("Commander", "Order now"), to: "/carte" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <img src={heroImg} alt={tr(`Petit-déjeuner livré ${preposition} ${nameAfterPreposition}`, `Breakfast delivered in ${nameAfterPreposition}`)} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: heroOverlay }} />
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-28 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
            style={{ backgroundColor: "rgba(223, 240, 87, 0.15)", border: "1px solid rgba(223, 240, 87, 0.4)", color: "#DFF057" }}
          >
            <MapPin size={12} />
            {tr("Zone de livraison", "Delivery area")} · {city.name}
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6 text-white">
            {tr(`Livraison petit-déjeuner & brunch ${preposition}`, "Breakfast & brunch delivery in")}{" "}
            <span className="italic" style={{ color: "#DFF057" }}>{nameAfterPreposition}</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.82)" }}>
            {intro}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(lp("/carte"))}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-bold transition-all hover:scale-105"
              style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
            >
              {tr("Commander", "Order now")}
              <ArrowRight size={16} />
            </button>
            <a
              href="#zone"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold border-2 text-white transition-colors hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.3)" }}
            >
              <MapPin size={16} />
              {tr("Vérifier mon adresse", "Check my address")}
            </a>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm" style={{ color: "rgba(255,255,255,0.72)" }}>
            <span className="flex items-center gap-2">
              <Check size={16} />
              {tr("Livré en", "Delivered in")} {deliveryTime}
            </span>
            <span className="flex items-center gap-2">
              <Check size={16} />
              {tr("Produits frais du matin", "Fresh morning products")}
            </span>
            <span className="flex items-center gap-2">
              <Check size={16} />
              English spoken
            </span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-20 px-6 -mt-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {stats.map((stat, i) => (
            <div key={i} className="bg-card rounded-2xl px-5 py-6 text-center" style={{ boxShadow: "var(--card-shadow)" }}>
              <stat.icon className="w-6 h-6 mx-auto mb-3 text-primary" />
              <p className="font-display text-lg sm:text-xl font-bold leading-none mb-1.5">{stat.value}</p>
              <p className="text-xs text-muted-foreground leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contexte local */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div className="relative">
            <img src={contextImg} alt={tr(`Brunch livré ${preposition} ${nameAfterPreposition}`, `Brunch delivered in ${nameAfterPreposition}`)} className="rounded-3xl w-full h-[380px] object-cover" />
            <div className="absolute -bottom-5 -right-3 sm:right-6 rounded-2xl px-5 py-4 bg-card" style={{ boxShadow: "var(--card-shadow)" }}>
              <p className="text-xs text-muted-foreground">{tr("Livré à", "Delivered in")}</p>
              <p className="font-display text-lg font-bold">{city.name}</p>
            </div>
          </div>
          <div>
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
              {tr("Livraison locale", "Local delivery")}
            </p>
            <h2 className="section-title mb-6">
              {tr(`Le petit-déjeuner, livré ${preposition}`, "Breakfast, delivered in")} {nameAfterPreposition}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">{context}</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate(lp("/carte"))}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                {tr("Découvrir la carte", "Discover the menu")}
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate(lp("/contact"))}
                className="inline-flex items-center gap-2 border-2 border-border px-6 py-3 rounded-full text-sm font-semibold hover:bg-muted transition-colors"
              >
                {tr("Devis entreprise", "Corporate quote")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quartiers desservis */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
            {tr("Couverture locale", "Local coverage")}
          </p>
          <h2 className="section-title mb-4">
            {tr(`Quartiers desservis ${preposition}`, "Areas covered in")} {nameAfterPreposition}
          </h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            {tr(`Toutes les zones que nous livrons ${preposition} ${nameAfterPreposition}.`, `All the areas we deliver to in ${nameAfterPreposition}.`)}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {city.quartiers.map((q) => (
              <span key={q} className="inline-flex items-center gap-2 bg-card rounded-full pl-3 pr-5 py-2.5 text-sm font-medium" style={{ boxShadow: "var(--card-shadow)" }}>
                <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin size={14} className="text-primary" />
                </span>
                {q}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Cas d'usage */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
              {tr("Pour quelles occasions ?", "For which occasions?")}
            </p>
            <h2 className="section-title">{tr("Un petit-déjeuner pour chaque occasion", "A breakfast for every occasion")}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-7">
            {city.useCases.map((uc, i) => {
              const card = occasionCards[i % occasionCards.length];
              return (
                <article key={i} className="group bg-card rounded-3xl overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-1" style={{ boxShadow: "var(--card-shadow)" }}>
                  <div className="relative h-52 overflow-hidden">
                    <img src={card.img} alt={isEn ? uc.title_en : uc.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-card/95 backdrop-blur flex items-center justify-center">
                      <card.icon size={18} className="text-primary" />
                    </div>
                    <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-card/95 backdrop-blur text-xs font-semibold">
                      {card.product}
                    </div>
                  </div>
                  <div className="p-7 flex flex-col flex-1">
                    <h3 className="font-display text-xl font-semibold mb-3">{isEn ? uc.title_en : uc.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{isEn ? uc.text_en : uc.text}</p>
                    <button
                      onClick={() => navigate(lp(card.to))}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
                    >
                      {card.ctaLabel}
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vérification d'éligibilité d'adresse */}
      <div id="zone" className="scroll-mt-20">
        <DeliveryZone variant="compact" />
      </div>

      {/* FAQ */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
              {tr("Bon à savoir", "Good to know")}
            </p>
            <h2 className="section-title">{tr("Questions fréquentes", "Frequently asked questions")}</h2>
          </div>
          <Accordion type="single" collapsible className="flex flex-col gap-3">
            {city.faq.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-card rounded-2xl overflow-hidden border-0" style={{ boxShadow: "var(--card-shadow)" }}>
                <AccordionTrigger className="px-6 py-5 hover:no-underline [&>svg]:text-primary">
                  <span className="font-display text-base sm:text-lg font-semibold text-left">{isEn ? f.q_en : f.q}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 text-sm text-muted-foreground leading-relaxed">
                  {isEn ? f.a_en : f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA final */}
      <section className="relative py-24 px-6 overflow-hidden">
        <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: ctaOverlay }} />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <Croissant className="mx-auto mb-5" style={{ color: "#DFF057" }} />
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-5 text-white">
            {tr(`Envie d'un petit-déjeuner ${preposition}`, "Fancy a breakfast in")}{" "}
            <span className="italic" style={{ color: "#DFF057" }}>{nameAfterPreposition}</span> ?
          </h2>
          <p className="mb-9" style={{ color: "rgba(255,255,255,0.7)" }}>
            {tr(`Livré en ${deliveryTime}, 7j/7 de 8h à 15h.`, `Delivered in ${deliveryTime}, 7 days a week from 8am to 3pm.`)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(lp("/carte"))}
              className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full text-base font-bold transition-all hover:scale-105"
              style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
            >
              {tr("Voir la carte", "See the menu")}
            </button>
            <button
              onClick={() => navigate(lp("/contact"))}
              className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full text-base font-semibold border-2 text-white transition-colors hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.3)" }}
            >
              {tr("Devis entreprise / événement", "Corporate / event quote")}
            </button>
          </div>
        </div>
      </section>

      {/* Maillage interne vers les autres villes */}
      <section className="py-14 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold tracking-widest uppercase mb-5 text-muted-foreground">
            {tr("Nous livrons aussi à", "We also deliver to")}
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {otherCities.map((c) => (
              <button
                key={c.slug}
                onClick={() => navigate(lp(`/livraison-petit-dejeuner-${c.slug}`))}
                className="px-5 py-2.5 rounded-full bg-card text-sm font-medium hover:text-primary transition-colors"
                style={{ boxShadow: "var(--card-shadow)" }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VillePage;
