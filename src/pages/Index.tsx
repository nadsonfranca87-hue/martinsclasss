import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CollectionSection from "@/components/CollectionSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <CollectionSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default Index;
