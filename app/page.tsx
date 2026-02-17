"use client";

import { CartProvider } from "@/components/cart-provider";
import ThemeApplicator from "@/components/theme-applicator";
import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import CollectionSection from "@/components/collection-section";
import AboutSection from "@/components/about-section";
import TestimonialsSection from "@/components/testimonials-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import CartDrawer from "@/components/cart-drawer";

export default function HomePage() {
  return (
    <CartProvider>
      <ThemeApplicator />
      <Navbar />
      <CartDrawer />
      <main>
        <HeroSection />
        <CollectionSection />
        <AboutSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </CartProvider>
  );
}
