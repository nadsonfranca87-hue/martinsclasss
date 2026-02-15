const Footer = () => {
  return (
    <footer className="border-t border-border py-16 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <a href="#" className="font-display text-xl tracking-[0.3em] text-foreground">
            MAISON
          </a>
          <p className="font-body text-xs text-muted-foreground">
            © 2026 Maison. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            {["Instagram", "Pinterest", "WhatsApp"].map((social) => (
              <a
                key={social}
                href="#"
                className="font-body text-xs text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
