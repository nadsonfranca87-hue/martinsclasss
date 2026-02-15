import heroImage from "@/assets/hero-fashion.jpg";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { getSiteData } from "@/lib/siteData";

const AboutSection = () => {
  const { data: settings } = useSiteSettings();
  const fallback = getSiteData();

  return (
    <section id="sobre" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <div className="relative aspect-[4/3] sm:aspect-[4/5] overflow-hidden bg-secondary">
            <img src={heroImage} alt="Sobre a Martins Class" className="w-full h-full object-cover" />
          </div>
          <div className="lg:pl-8">
            <p className="font-body text-xs letter-wider uppercase text-muted-foreground mb-3 sm:mb-4">SOBRE NÓS</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground mb-6 sm:mb-8">
              {settings?.about_title || fallback.aboutTitle}
            </h2>
            <div className="space-y-4 sm:space-y-6">
              <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed">
                {settings?.about_text1 || fallback.aboutText1}
              </p>
              <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed">
                {settings?.about_text2 || fallback.aboutText2}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-8 sm:mt-12 pt-8 sm:pt-12 border-t border-border">
              {[
                { number: "500+", label: "Peças" },
                { number: "10k+", label: "Clientes" },
                { number: "12", label: "Anos" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-2xl sm:text-3xl text-primary">{stat.number}</p>
                  <p className="font-body text-[10px] sm:text-xs letter-wide uppercase text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
