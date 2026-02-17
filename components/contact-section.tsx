"use client";

import { useSiteSettings } from "@/components/theme-applicator";
import { defaultSiteData } from "@/lib/site-data";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export default function ContactSection() {
  const { data: settings } = useSiteSettings();

  const email = settings?.contact_email || defaultSiteData.contactEmail;
  const phone = settings?.contact_phone || defaultSiteData.contactPhone;
  const address = settings?.contact_address || defaultSiteData.contactAddress;
  const whatsapp = settings?.whatsapp_link || defaultSiteData.whatsappLink;
  const instagram =
    settings?.instagram_link || defaultSiteData.instagramLink;

  return (
    <section id="contato" className="py-16 sm:py-24 lg:py-32 bg-secondary/30 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10 sm:mb-16">
          <p className="font-body text-xs letter-wider uppercase text-muted-foreground mb-3 sm:mb-4">
            CONTATO
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground mb-4 sm:mb-6 text-balance">
            Fale com a gente
          </h2>
          <p className="font-body text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Estamos aqui para ajudar voce a encontrar a peca perfeita
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <a
            href={`mailto:${email}`}
            className="group flex flex-col items-center p-6 sm:p-8 border border-border hover:border-primary transition-colors duration-300"
          >
            <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary mb-3 sm:mb-4" />
            <p className="font-body text-xs letter-wide uppercase text-muted-foreground mb-1 sm:mb-2">
              Email
            </p>
            <p className="font-body text-xs sm:text-sm text-foreground text-center break-all">
              {email}
            </p>
          </a>

          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center p-6 sm:p-8 border border-border hover:border-primary transition-colors duration-300"
          >
            <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-primary mb-3 sm:mb-4" />
            <p className="font-body text-xs letter-wide uppercase text-muted-foreground mb-1 sm:mb-2">
              WhatsApp
            </p>
            <p className="font-body text-xs sm:text-sm text-foreground">{phone}</p>
          </a>

          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group sm:col-span-2 lg:col-span-1 flex flex-col items-center p-6 sm:p-8 border border-border hover:border-primary transition-colors duration-300"
          >
            <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary mb-3 sm:mb-4" />
            <p className="font-body text-xs letter-wide uppercase text-muted-foreground mb-1 sm:mb-2">
              Local
            </p>
            <p className="font-body text-xs sm:text-sm text-foreground text-center">
              {address}
            </p>
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto font-body text-xs letter-wide uppercase bg-primary text-primary-foreground flex items-center justify-center gap-2 px-8 sm:px-10 py-4 hover:bg-primary/90 transition-colors duration-300"
          >
            <span>Chame no WhatsApp</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto font-body text-xs letter-wide uppercase border border-foreground/30 text-foreground flex items-center justify-center gap-2 px-8 sm:px-10 py-4 hover:bg-foreground/5 transition-colors duration-300"
          >
            <span>Instagram</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </section>
  );
}
