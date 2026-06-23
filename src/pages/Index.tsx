import { usePageMeta } from "@/hooks/usePageMeta";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import MenuSection from "@/components/MenuSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import AboutSection from "@/components/AboutSection";
import DeliveryZone from "@/components/DeliveryZone";
import EventsPromo from "@/components/EventsPromo";
import UGCVideos from "@/components/UGCVideos";
import OrderOnline from "@/components/OrderOnline";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import PromoPopup from "@/components/PromoPopup";

const VALID_PROMOS: Record<string, string> = {
  BONJOUR20: "-20%",
};

const Index = () => {
  usePageMeta(
    "Breakfast Time — Petit-déjeuner & brunch livré à domicile",
    "Livraison de petits-déjeuners et brunch à domicile dans les Alpes Maritimes. Commande et livraison le jour même. 7j/7, 8h-15h. Produits frais et de saison. Large choix de menus et produits à la carte. Cannes, Antibes, Nice et alentours.",
    "/"
  );

  const [searchParams] = useSearchParams();
  const [showLaunchPopup, setShowLaunchPopup] = useState(false);
  const [promoPopup, setPromoPopup] = useState<{ code: string; discount: string } | null>(null);

  useEffect(() => {
    // Vérifier si un code promo est dans l'URL
    const promoParam = searchParams.get("promo")?.toUpperCase();
    if (promoParam && VALID_PROMOS[promoParam]) {
      sessionStorage.setItem("bt_promo_code", promoParam);
      setPromoPopup({ code: promoParam, discount: VALID_PROMOS[promoParam] });
      return;
    }

    // Sinon, popup lancement
    const seen = sessionStorage.getItem("bt_popup_seen");
    if (!seen) {
      const timer = setTimeout(() => setShowLaunchPopup(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    sessionStorage.setItem("bt_popup_seen", "1");
    setShowLaunchPopup(false);
  };

  return (
  <>
    <Navbar />

    {/* Pop-up code promo QR */}
    {promoPopup && (
      <PromoPopup
        code={promoPopup.code}
        discount={promoPopup.discount}
        onClose={() => setPromoPopup(null)}
      />
    )}

    {/* Pop-up lancement */}
    {showLaunchPopup && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={closePopup}
      >
        <div
          className="bg-white rounded-2xl p-8 max-w-sm w-full text-center relative"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-5xl mb-4">☀️</div>
          <h2 className="font-display text-2xl font-bold mb-3">Nous arrivons bientôt !</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Breakfast Time sera disponible <strong>début été 2026</strong>. En attendant, explorez notre carte et nos menus.
          </p>
          <button
            onClick={closePopup}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Découvrir la carte →
          </button>
        </div>
      </div>
    )}
    <main>
      <HeroSection />
      <MenuSection />
      <OrderOnline />
      <EventsPromo />
      <UGCVideos />
      <HowItWorks />
      <DeliveryZone />
      <WhyChooseUs />
      <AboutSection />
      <FinalCTA />
    </main>
    <Footer />
  </>
  );
};

export default Index;
