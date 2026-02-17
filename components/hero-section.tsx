"use client";

import { useSiteSettings } from "@/components/theme-applicator";
import { defaultSiteData } from "@/lib/site-data";
import Image from "next/image";

export default function HeroSection() {
  const { data: settings } = useSiteSettings();

  const heroTitle = settings?.hero_title || defaultSiteData.heroTitle;
  const heroSubtitle = settings?.hero_subtitle || defaultSiteData.heroSubtitle;
  const heroDescription =
    settings?.hero_description || defaultSiteData.heroDescription;
  const bgImage = settings?.hero_bg_image || "/images/hero-fashion.jpg";
  const logoSrc = settings?.logo_url || "/images/logo.jpg";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={bgImage}
          alt="Moda elegante - colecao atual"
          fill
          className="object-cover object-center opacity-40"
          style={{ objectPosition: "center 30%" }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <div
          className="flex justify-center mb-4 sm:mb-6 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <Image
            src={logoSrc}
            alt="Martins Class Logo"
            width={112}
            height={112}
            className="h-20 w-20 sm:h-28 sm:w-28 object-contain rounded-full"
          />
        </div>
        <p
          className="font-body text-[10px] sm:text-xs letter-wider uppercase text-muted-foreground mb-4 sm:mb-6 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          {heroSubtitle}
        </p>
        <h1
          className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-normal text-foreground mb-6 sm:mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.4s", opacity: 0 }}
        >
          {heroTitle}
        </h1>
        <p
          className="font-body text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8 sm:mb-12 animate-fade-in-up leading-relaxed"
          style={{ animationDelay: "0.6s", opacity: 0 }}
        >
          {heroDescription}
        </p>
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 animate-fade-in-up"
          style={{ animationDelay: "0.8s", opacity: 0 }}
        >
          <a
            href="#colecao"
            className="w-full sm:w-auto font-body text-xs letter-wide uppercase bg-primary text-primary-foreground px-10 py-4 hover:bg-primary/90 transition-colors duration-300 text-center"
          >
            Ver Colecao
          </a>
          <a
            href="#contato"
            className="w-full sm:w-auto font-body text-xs letter-wide uppercase border border-foreground/30 text-foreground px-10 py-4 hover:bg-foreground/5 transition-colors duration-300 text-center"
          >
            Contato
          </a>
        </div>
      </div>

      <div
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 animate-fade-in"
        style={{ animationDelay: "1.2s" }}
      >
        <p className="font-body text-[10px] letter-wider uppercase text-muted-foreground">
          {"↓ Role para descobrir"}
        </p>
      </div>
    </section>
  );
}
