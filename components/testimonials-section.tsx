"use client";

import { useState } from "react";
import useSWR from "swr";
import { createClient } from "@/lib/supabase/client";
import { defaultTestimonials } from "@/lib/site-data";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

async function fetchTestimonials() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data && data.length > 0 ? data : defaultTestimonials;
}

export default function TestimonialsSection() {
  const { data: testimonials } = useSWR("testimonials", fetchTestimonials);
  const [idx, setIdx] = useState(0);

  const items = testimonials || defaultTestimonials;

  const prev = () => setIdx((i) => (i === 0 ? items.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === items.length - 1 ? 0 : i + 1));

  const currentItem = items[idx];

  return (
    <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl text-center">
        <p className="font-body text-xs letter-wider uppercase text-muted-foreground mb-3 sm:mb-4">
          DEPOIMENTOS
        </p>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground mb-10 sm:mb-16 text-balance">
          O que nossos clientes dizem
        </h2>

        <div className="relative">
          <Quote className="h-8 w-8 sm:h-10 sm:w-10 text-primary/30 mx-auto mb-4 sm:mb-6" />

          <p className="font-body text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto min-h-[60px] sm:min-h-[80px]">
            {currentItem.message}
          </p>

          <div className="flex justify-center gap-1 mb-3 sm:mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 sm:h-4 sm:w-4 ${
                  i < (currentItem.rating || 5)
                    ? "text-primary fill-primary"
                    : "text-muted"
                }`}
              />
            ))}
          </div>

          <p className="font-display text-sm sm:text-base text-foreground">
            {currentItem.customer_name}
          </p>

          <div className="flex items-center justify-center gap-4 mt-6 sm:mt-10">
            <button
              onClick={prev}
              className="p-2 sm:p-3 border border-border hover:border-primary hover:text-primary transition-colors duration-300"
              aria-label="Depoimento anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-body text-xs text-muted-foreground">
              {idx + 1} / {items.length}
            </span>
            <button
              onClick={next}
              className="p-2 sm:p-3 border border-border hover:border-primary hover:text-primary transition-colors duration-300"
              aria-label="Proximo depoimento"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
