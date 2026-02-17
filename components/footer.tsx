"use client";

import { useSiteSettings } from "@/components/theme-applicator";
import { defaultSiteData } from "@/lib/site-data";

export default function Footer() {
  const { data: settings } = useSiteSettings();
  const whatsapp = settings?.whatsapp_link || defaultSiteData.whatsappLink;
  const instagram = settings?.instagram_link || defaultSiteData.instagramLink;
  const email = settings?.contact_email || defaultSiteData.contactEmail;

  return (
    <footer className="py-10 sm:py-16 border-t border-border px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="text-center md:text-left">
            <p className="font-display text-lg sm:text-xl text-foreground tracking-[0.15em] sm:tracking-[0.2em]">
              MARTINS CLASS
            </p>
            <p className="font-body text-xs text-muted-foreground mt-1">
              Moda com elegancia
            </p>
          </div>

          <div className="flex items-center gap-6 sm:gap-8">
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs letter-wide uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Instagram
            </a>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs letter-wide uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              WhatsApp
            </a>
            <a
              href={`mailto:${email}`}
              className="font-body text-xs letter-wide uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Email
            </a>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border text-center">
          <p className="font-body text-[10px] sm:text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Martins Class. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
