import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Martins Class - Moda com Elegancia",
  description:
    "Elegancia atemporal para quem busca pecas unicas. Roupas que contam historias e definem estilos.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "hsl(0 0% 7%)",
              border: "1px solid hsl(0 0% 16%)",
              color: "hsl(40 20% 90%)",
            },
          }}
        />
      </body>
    </html>
  );
}
