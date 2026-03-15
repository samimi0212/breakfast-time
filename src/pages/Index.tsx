import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import MenuSection from "@/components/MenuSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import AboutSection from "@/components/AboutSection";
import DeliveryZone from "@/components/DeliveryZone";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => (
  <>
    <Navbar />
    <main>
      <HeroSection />
      <HowItWorks />
      <MenuSection />
      <WhyChooseUs />
      <Testimonials />
      <AboutSection />
      <DeliveryZone />
      <FinalCTA />
    </main>
    <Footer />
  </>
);

export default Index;
