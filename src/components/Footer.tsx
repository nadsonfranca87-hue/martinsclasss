import logo from "@/assets/logo.jpeg";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { getSiteData } from "@/lib/siteData";

const Footer = () => {
  const { data: settings } = useSiteSettings();
  const fallback = getSiteData();

  return (
    <footer className="border-t border-border py-10 sm:py-16 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-6 sm:gap-8 md:flex-row md:justify-between">
          <a href="#" className="flex items-center gap-2 sm:gap-3">
            <img src={logo} alt="Martins Class" className="h-8 w-8 sm:h-10 sm:w-10 object-contain rounded-full" />
            <span className="font-display text-base sm:text-lg tracking-[0.2em] text-foreground">MARTINS CLASS</span>
          </a>
          <p className="font-body text-[10px] sm:text-xs text-muted-foreground text-center">
            {settings?.footer_text || "© 2026 Martins Class. Todos os direitos reservados."}
          </p>
          <div className="flex gap-6">
            <a href={settings?.whatsapp_link || fallback.whatsappLink} target="_blank" rel="noopener noreferrer" className="font-body text-xs text-muted-foreground hover:text-primary transition-colors duration-300">WhatsApp</a>
            <a href={settings?.instagram_link || fallback.instagramLink} target="_blank" rel="noopener noreferrer" className="font-body text-xs text-muted-foreground hover:text-primary transition-colors duration-300">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
