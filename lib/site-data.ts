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
}

export const defaultSiteData: SiteData = {
  heroTitle: "Martins Class",
  heroSubtitle: "Nova Colecao 2026",
  heroDescription:
    "Elegancia atemporal para quem busca pecas unicas. Roupas que contam historias e definem estilos.",
  aboutTitle: "Moda com proposito e elegancia",
  aboutText1:
    "A Martins Class nasceu da paixao por criar pecas que transcendem tendencias. Com mais de uma decada de experiencia no universo da moda, nossa curadoria busca o equilibrio perfeito entre estetica contemporanea e conforto atemporal.",
  aboutText2:
    "Cada peca da nossa colecao e cuidadosamente selecionada, priorizando materiais sustentaveis e processos de fabricacao eticos. Acreditamos que a verdadeira elegancia esta na simplicidade e na qualidade.",
  contactEmail: "contato@martinsclass.com.br",
  contactPhone: "+55 11 9999-0000",
  contactAddress: "Rua Oscar Freire, 123 -- Sao Paulo, SP",
  whatsappLink: "https://wa.me/5585997692382",
  instagramLink: "https://instagram.com/martinsclass",
};

export const defaultTestimonials = [
  {
    id: "1",
    customer_name: "Maria Silva",
    rating: 5,
    message:
      "Pecas incriveis! A qualidade e excepcional e o atendimento e maravilhoso. Recomendo demais!",
    customer_photo: "",
  },
  {
    id: "2",
    customer_name: "Joao Santos",
    rating: 5,
    message:
      "Comprei para presentear minha esposa e ela amou. Entrega rapida e embalagem impecavel.",
    customer_photo: "",
  },
  {
    id: "3",
    customer_name: "Ana Costa",
    rating: 5,
    message:
      "Sempre encontro pecas unicas aqui. A Martins Class tem o melhor custo-beneficio da moda!",
    customer_photo: "",
  },
];
