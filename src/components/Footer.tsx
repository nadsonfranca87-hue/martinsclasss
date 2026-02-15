import logo from "@/assets/logo.jpeg";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { getSiteData } from "@/lib/siteData";

const Footer = () => {
  const { data: settings } = useSiteSettings();
  const fallback = getSiteData();

  return (
    <footer className="border-t border-border py-16 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <a href="#" className="flex items-center gap-3">
            <img src={logo} alt="Martins Class" className="h-10 w-10 object-contain rounded-full" />
            <span className="font-display text-lg tracking-[0.2em] text-foreground">MARTINS CLASS</span>
          </a>
          <p className="font-body text-xs text-muted-foreground">
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
