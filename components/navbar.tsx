"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { useSiteSettings } from "@/components/theme-applicator";
import Image from "next/image";

const navItems = [
  { label: "Colecao", href: "#colecao" },
  { label: "Categorias", href: "/categorias" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, setIsOpen } = useCart();
  const { data: settings } = useSiteSettings();
  const router = useRouter();
  const pathname = usePathname();
  const logo = settings?.logo_url || "/images/logo.jpg";

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("#")) {
      if (pathname !== "/") {
        router.push("/" + href);
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(href);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      if (mobileOpen) setMobileOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <button
          onClick={() => handleNavClick("/")}
          className="flex items-center gap-2 sm:gap-3"
        >
          <Image
            src={logo}
            alt="Martins Class"
            width={48}
            height={48}
            className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-full"
          />
          <span className="font-display text-base sm:text-lg tracking-[0.15em] sm:tracking-[0.2em] text-foreground hidden sm:inline">
            MARTINS CLASS
          </span>
        </button>

        <ul className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => handleNavClick(item.href)}
                className="font-body text-xs letter-wide uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Abrir carrinho"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-body w-5 h-5 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      <div
        className={`md:hidden fixed inset-0 top-[56px] bg-background/98 backdrop-blur-lg transition-all duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col items-center justify-center h-full gap-10">
          {navItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => handleNavClick(item.href)}
                className="font-display text-2xl text-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
