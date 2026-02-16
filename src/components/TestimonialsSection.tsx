import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import testimonialsBg from "@/assets/testimonials-bg.jpg";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const { data: testimonials } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  const defaultTestimonials = [
    { id: "1", customer_name: "Maria Silva", rating: 5, message: "Peças incríveis! A qualidade é excepcional e o atendimento é maravilhoso. Recomendo demais!", customer_photo: "" },
    { id: "2", customer_name: "João Santos", rating: 5, message: "Comprei para presentear minha esposa e ela amou. Entrega rápida e embalagem impecável.", customer_photo: "" },
    { id: "3", customer_name: "Ana Costa", rating: 5, message: "Sempre encontro peças únicas aqui. A Martins Class tem o melhor custo-benefício da moda!", customer_photo: "" },
  ];

  const items = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;

  return (
    <section className="relative py-20 sm:py-28 lg:py-36 px-4 sm:px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={testimonialsBg} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>

      <div className="relative z-10 container mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <p className="font-body text-xs letter-wider uppercase text-muted-foreground mb-3 sm:mb-4">DEPOIMENTOS</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground mb-4 sm:mb-6">
            O que nossos clientes dizem
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {items.map((t: any) => (
            <div
              key={t.id}
              className="bg-card/60 backdrop-blur-sm border border-border p-6 sm:p-8 space-y-4 hover:border-primary/30 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Message */}
              <p className="font-body text-sm sm:text-base text-foreground/80 leading-relaxed italic">
                "{t.message}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                {t.customer_photo ? (
                  <img src={t.customer_photo} alt={t.customer_name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-display text-sm text-primary">
                      {t.customer_name.charAt(0)}
                    </span>
                  </div>
                )}
                <p className="font-body text-sm text-foreground">{t.customer_name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
