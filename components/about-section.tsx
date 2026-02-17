"use client";

import { useSiteSettings } from "@/components/theme-applicator";
import { defaultSiteData } from "@/lib/site-data";
import { Award, Leaf, Heart, Truck } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Qualidade Premium",
    text: "Materiais selecionados com rigor e acabamento impecavel",
  },
  {
    icon: Leaf,
    title: "Moda Sustentavel",
    text: "Compromisso com praticas eticas e materiais conscientes",
  },
  {
    icon: Heart,
    title: "Curadoria Exclusiva",
    text: "Pecas unicas selecionadas para voce com muito carinho",
  },
  {
    icon: Truck,
    title: "Entrega Segura",
    text: "Entrega cuidadosa para todo o Brasil com rastreamento",
  },
];

export default function AboutSection() {
  const { data: settings } = useSiteSettings();

  const title = settings?.about_title || defaultSiteData.aboutTitle;
  const text1 = settings?.about_text1 || defaultSiteData.aboutText1;
  const text2 = settings?.about_text2 || defaultSiteData.aboutText2;

  return (
    <section id="sobre" className="py-16 sm:py-24 lg:py-32 bg-secondary/30 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-20">
          <p className="font-body text-xs letter-wider uppercase text-muted-foreground mb-3 sm:mb-4">
            SOBRE NOS
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground mb-6 sm:mb-8 text-balance">
            {title}
          </h2>
          <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 sm:mb-6">
            {text1}
          </p>
          <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed">
            {text2}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {features.map((f) => (
            <div key={f.title} className="text-center group">
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 sm:mb-6 border border-primary/30 group-hover:border-primary transition-colors duration-500">
                <f.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="font-display text-sm sm:text-base text-foreground mb-2 sm:mb-3">
                {f.title}
              </h3>
              <p className="font-body text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
