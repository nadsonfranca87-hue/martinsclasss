import { useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { getSiteData } from "@/lib/siteData";

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const { data: settings } = useSiteSettings();
  const fallback = getSiteData();

  const whatsappLink = settings?.whatsapp_link || fallback.whatsappLink;
  const instagramLink = settings?.instagram_link || fallback.instagramLink;
  const contactEmail = settings?.contact_email || fallback.contactEmail;
  const contactPhone = settings?.contact_phone || fallback.contactPhone;
  const contactAddress = settings?.contact_address || fallback.contactAddress;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMsg = encodeURIComponent(`Olá! Meu nome é ${formData.name}. ${formData.message}`);
    window.open(`${whatsappLink}?text=${whatsappMsg}`, "_blank");
  };

  return (
    <section id="contato" className="py-32 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <p className="font-body text-xs letter-wider uppercase text-muted-foreground mb-4">CONTATO</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">Vamos conversar?</h2>
          <p className="font-body text-muted-foreground max-w-md mx-auto">
            Entre em contato para saber mais sobre nossas peças ou fazer uma encomenda especial
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <h3 className="font-display text-2xl text-foreground">Informações</h3>
            <div className="space-y-6">
              {[
                { label: "Email", value: contactEmail, href: `mailto:${contactEmail}` },
                { label: "Telefone", value: contactPhone, href: `tel:${contactPhone.replace(/\s/g, "")}` },
                { label: "Endereço", value: contactAddress, href: "#" },
              ].map((item) => (
                <a key={item.label} href={item.href} className="block border-b border-border pb-4 hover:border-primary transition-colors group">
                  <p className="font-body text-[10px] letter-wide uppercase text-muted-foreground mb-1">{item.label}</p>
                  <p className="font-body text-foreground group-hover:text-primary transition-colors">{item.value}</p>
                </a>
              ))}
            </div>
            <div>
              <p className="font-body text-[10px] letter-wide uppercase text-muted-foreground mb-3">Redes Sociais</p>
              <div className="flex gap-6">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors duration-300">WhatsApp</a>
                <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors duration-300">Instagram</a>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="font-body text-[10px] letter-wide uppercase text-muted-foreground mb-2 block">Nome</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-transparent border-b border-border py-3 font-body text-foreground focus:outline-none focus:border-primary transition-colors duration-300" />
            </div>
            <div>
              <label className="font-body text-[10px] letter-wide uppercase text-muted-foreground mb-2 block">Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-transparent border-b border-border py-3 font-body text-foreground focus:outline-none focus:border-primary transition-colors duration-300" />
            </div>
            <div>
              <label className="font-body text-[10px] letter-wide uppercase text-muted-foreground mb-2 block">Mensagem</label>
              <textarea rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full bg-transparent border-b border-border py-3 font-body text-foreground focus:outline-none focus:border-primary transition-colors duration-300 resize-none" />
            </div>
            <button type="submit" className="font-body text-xs letter-wide uppercase bg-primary text-primary-foreground px-10 py-4 hover:bg-primary/90 transition-colors duration-300 w-full mt-4">
              Enviar via WhatsApp
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
