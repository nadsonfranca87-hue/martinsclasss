import collection1 from "@/assets/collection-1.jpg";
import collection2 from "@/assets/collection-2.jpg";
import collection3 from "@/assets/collection-3.jpg";
import collection4 from "@/assets/collection-4.jpg";
import collection5 from "@/assets/collection-5.jpg";
import collection6 from "@/assets/collection-6.jpg";
import collection7 from "@/assets/collection-7.jpg";
import collection8 from "@/assets/collection-8.jpg";
import collection9 from "@/assets/collection-9.jpg";
import collection10 from "@/assets/collection-10.jpg";
import collection11 from "@/assets/collection-11.jpg";
import collection12 from "@/assets/collection-12.jpg";

export interface Product {
  id: string;
  image: string;
  title: string;
  category: string;
  price: string;
}

export interface SiteData {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  aboutTitle: string;
  aboutText1: string;
  aboutText2: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  whatsappLink: string;
  instagramLink: string;
  products: Product[];
}

const defaultProducts: Product[] = [
  { id: "1", image: collection1, title: "Camisa Linho Natural", category: "Roupas", price: "R$ 289" },
  { id: "2", image: collection2, title: "Casaco Oversized Noir", category: "Roupas", price: "R$ 599" },
  { id: "3", image: collection3, title: "Vestido Seda Dourada", category: "Novidades", price: "R$ 459" },
  { id: "4", image: collection4, title: "Bolsa & Óculos Set", category: "Acessórios", price: "R$ 349" },
  { id: "5", image: collection5, title: "Blazer Terracota", category: "Roupas", price: "R$ 489" },
  { id: "6", image: collection6, title: "Tricô Creme Premium", category: "Novidades", price: "R$ 329" },
  { id: "7", image: collection7, title: "Vestido Linho Branco", category: "Roupas", price: "R$ 419" },
  { id: "8", image: collection8, title: "Sapato & Cinto Couro", category: "Acessórios", price: "R$ 699" },
  { id: "9", image: collection9, title: "Jeans Premium Clássico", category: "Roupas", price: "R$ 359" },
  { id: "10", image: collection10, title: "Relógio & Pulseira Gold", category: "Acessórios", price: "R$ 899" },
  { id: "11", image: collection11, title: "Vestido Noir Elegance", category: "Novidades", price: "R$ 549" },
  { id: "12", image: collection12, title: "Echarpes Cashmere Set", category: "Acessórios", price: "R$ 279" },
];

const defaultData: SiteData = {
  heroTitle: "Martins Class",
  heroSubtitle: "Nova Coleção 2026",
  heroDescription: "Elegância atemporal para quem busca peças únicas. Roupas que contam histórias e definem estilos.",
  aboutTitle: "Moda com propósito e elegância",
  aboutText1: "A Martins Class nasceu da paixão por criar peças que transcendem tendências. Com mais de uma década de experiência no universo da moda, nossa curadoria busca o equilíbrio perfeito entre estética contemporânea e conforto atemporal.",
  aboutText2: "Cada peça da nossa coleção é cuidadosamente selecionada, priorizando materiais sustentáveis e processos de fabricação éticos. Acreditamos que a verdadeira elegância está na simplicidade e na qualidade.",
  contactEmail: "contato@martinsclass.com.br",
  contactPhone: "+55 11 9999-0000",
  contactAddress: "Rua Oscar Freire, 123 — São Paulo, SP",
  whatsappLink: "https://wa.me/5585997692382",
  instagramLink: "https://instagram.com/martinsclass",
  products: defaultProducts,
};

const STORAGE_KEY = "martinsclass_site_data";

export function getSiteData(): SiteData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure new products have images
      return {
        ...defaultData,
        ...parsed,
        products: parsed.products?.length > 0 ? parsed.products : defaultProducts,
      };
    }
  } catch {
    // ignore
  }
  return defaultData;
}

export function saveSiteData(data: SiteData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getDefaultProducts(): Product[] {
  return defaultProducts;
}
