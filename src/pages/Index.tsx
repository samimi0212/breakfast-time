import { usePageMeta } from "@/hooks/usePageMeta";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import MenuSection from "@/components/MenuSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import AboutSection from "@/components/AboutSection";
import DeliveryZone from "@/components/DeliveryZone";
import EventsPromo from "@/components/EventsPromo";
import OrderOnline from "@/components/OrderOnline";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => {
  usePageMeta(
    "Breakfast Time — Petit-déjeuner & brunch livré à domicile",
    "Breakfast Time livre des petits-déjeuners et brunchs d'exception dans les Alpes-Maritimes. Produits frais, locaux, livrés en 30 minutes. 7j/7.",
    "/"
  );

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("bt_popup_seen");
    if (!seen) {
      const timer = setTimeout(() => setShowPopup(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    sessionStorage.setItem("bt_popup_seen", "1");
    setShowPopup(false);
  };

  return (
  <>
    <Navbar />

    {/* Pop-up lancement */}
    {showPopup && (
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
      <HowItWorks />
      <WhyChooseUs />
      <AboutSection />
      <DeliveryZone />
      <FinalCTA />
    </main>
    <Footer />
  </>
  );
};

export default Index;
