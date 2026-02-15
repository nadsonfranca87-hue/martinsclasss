import heroImage from "@/assets/hero-fashion.jpg";
import logo from "@/assets/logo.jpeg";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { getSiteData } from "@/lib/siteData";

const HeroSection = () => {
  const { data: settings } = useSiteSettings();
  const fallback = getSiteData();

  const heroTitle = settings?.hero_title || fallback.heroTitle;
  const heroSubtitle = settings?.hero_subtitle || fallback.heroSubtitle;
  const heroDescription = settings?.hero_description || fallback.heroDescription;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="Moda elegante - coleção atual" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="flex justify-center mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <img src={logo} alt="Martins Class Logo" className="h-28 w-28 object-contain rounded-full" />
        </div>
        <p className="font-body text-xs letter-wider uppercase text-muted-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {heroSubtitle}
        </p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-normal text-foreground mb-8 animate-fade-in-up" style={{ animationDelay: "0.4s", opacity: 0 }}>
          {heroTitle}
        </h1>
        <p className="font-body text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-12 animate-fade-in-up leading-relaxed" style={{ animationDelay: "0.6s", opacity: 0 }}>
          {heroDescription}
        </p>
        <div className="flex items-center justify-center gap-6 animate-fade-in-up" style={{ animationDelay: "0.8s", opacity: 0 }}>
          <a href="#colecao" className="font-body text-xs letter-wide uppercase bg-primary text-primary-foreground px-10 py-4 hover:bg-primary/90 transition-colors duration-300">
            Ver Coleção
          </a>
          <a href="#contato" className="font-body text-xs letter-wide uppercase border border-foreground/30 text-foreground px-10 py-4 hover:bg-foreground/5 transition-colors duration-300">
            Contato
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: "1.2s" }}>
        <p className="font-body text-[10px] letter-wider uppercase text-muted-foreground">↓ Role para descobrir</p>
      </div>
    </section>
  );
};

export default HeroSection;
