import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useLangPath } from "@/hooks/useLangPath";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "./NotFound";
import { getCityBySlug, cities } from "@/data/cities";
import { MapPin, Clock, Check, ShoppingBag, Phone, Info } from "lucide-react";

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
  const coverageNote = isEn ? city.coverageNote_en : city.coverageNote;
  const deliveryTime = isEn ? city.deliveryTime_en : city.deliveryTime;
  const otherCities = cities.filter((c) => c.slug !== slug);

  const tr = (fr: string, en: string) => (isEn ? en : fr);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="pt-32 pb-16 px-6 text-center" style={{ backgroundColor: "#f4f1ea" }}>
        <div className="max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
            style={{ backgroundColor: "rgba(58,58,10,0.08)", color: "#5a5a1a" }}
          >
            <MapPin size={12} />
            {tr("Zone de livraison", "Delivery area")}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-5 leading-tight" style={{ color: "#2a2a08" }}>
            {tr("Livraison petit-déjeuner & brunch à", "Breakfast & brunch delivery in")}{" "}
            <span className="italic" style={{ color: "#7a7020" }}>{city.name}</span>
          </h1>
          <p className="text-base leading-relaxed mb-8 max-w-xl mx-auto" style={{ color: "#5a5a40" }}>
            {intro}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(lp("/carte"))}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
            >
              <ShoppingBag size={16} />
              {tr("Commander", "Order now")}
            </button>
            <div
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold"
              style={{ backgroundColor: "rgba(58,58,10,0.06)", color: "#3a3a0a" }}
            >
              <Clock size={16} />
              {tr("Livré en", "Delivered in")} {deliveryTime}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Note de couverture honnête (Nice) */}
          {coverageNote && (
            <div
              className="flex items-start gap-3 p-4 rounded-2xl mb-12"
              style={{ backgroundColor: "rgba(58,58,10,0.05)", border: "1px solid rgba(58,58,10,0.12)" }}
            >
              <Info size={18} className="text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">{coverageNote}</p>
            </div>
          )}

          {/* Contexte local */}
          <p className="text-lg text-muted-foreground leading-relaxed mb-12">{context}</p>

          {/* Quartiers desservis */}
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
            {tr("Quartiers desservis à", "Areas covered in")} {city.name}
          </h2>
          <div className="flex flex-wrap gap-2.5 mb-16">
            {city.quartiers.map((q) => (
              <span
                key={q}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium"
                style={{ backgroundColor: "rgba(223, 240, 87, 0.25)", color: "#3a3a0a" }}
              >
                <MapPin size={13} />
                {q}
              </span>
            ))}
          </div>

          {/* Cas d'usage */}
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">
            {tr("Pour quelles occasions ?", "For which occasions?")}
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            {city.useCases.map((uc, i) => (
              <div key={i} className="p-6 rounded-2xl" style={{ backgroundColor: "#f4f1ea" }}>
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
                  <Check size={18} className="text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold mb-2" style={{ color: "#2a2a08" }}>
                  {isEn ? uc.title_en : uc.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{isEn ? uc.text_en : uc.text}</p>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">
            {tr("Questions fréquentes", "Frequently asked questions")}
          </h2>
          <div className="space-y-6 mb-4">
            {city.faq.map((f, i) => (
              <div key={i}>
                <h3 className="font-semibold text-lg mb-2" style={{ color: "#2a2a08" }}>
                  {isEn ? f.q_en : f.q}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{isEn ? f.a_en : f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div
        className="relative py-16 px-6 overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(61, 45%, 20%) 0%, hsl(30, 10%, 8%) 100%)" }}
      >
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: "white" }}>
            {tr("Envie d'un petit-déjeuner à", "Fancy a breakfast in")}{" "}
            <span className="italic" style={{ color: "#DFF057" }}>{city.name}</span> ?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <button
              onClick={() => navigate(lp("/carte"))}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: "#DFF057", color: "#3a3a0a" }}
            >
              <ShoppingBag size={18} />
              {tr("Voir la carte", "See the menu")}
            </button>
            <button
              onClick={() => navigate(lp("/evenements"))}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold border-2 transition-colors hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}
            >
              <Phone size={18} />
              {tr("Devis entreprise / événement", "Corporate / event quote")}
            </button>
          </div>
        </div>
      </div>

      {/* Maillage interne vers les autres villes */}
      <div className="py-12 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold tracking-widest uppercase mb-5 text-muted-foreground">
            {tr("Nous livrons aussi à", "We also deliver to")}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {otherCities.map((c) => (
              <button
                key={c.slug}
                onClick={() => navigate(lp(`/livraison-petit-dejeuner-${c.slug}`))}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-primary/10"
                style={{ border: "1px solid rgba(58,58,10,0.18)", color: "#3a3a0a" }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VillePage;
