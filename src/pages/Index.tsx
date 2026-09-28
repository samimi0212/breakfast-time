import { usePageMeta } from "@/hooks/usePageMeta";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MenuSection from "@/components/MenuSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import AboutSection from "@/components/AboutSection";
import EventsPromo from "@/components/EventsPromo";
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
  const [promoPopup, setPromoPopup] = useState<{ code: string; discount: string } | null>(null);

  useEffect(() => {
    // Vérifier si un code promo est dans l'URL
    const promoParam = searchParams.get("promo")?.toUpperCase();
    if (promoParam && VALID_PROMOS[promoParam]) {
      sessionStorage.setItem("bt_promo_code", promoParam);
      setPromoPopup({ code: promoParam, discount: VALID_PROMOS[promoParam] });
    }
  }, []);

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
    <main>
      <HeroSection />
      <MenuSection />
      <OrderOnline />
      <EventsPromo />
      <WhyChooseUs />
      <AboutSection />
      <FinalCTA />
    </main>
    <Footer />
  </>
  );
};

export default Index;
