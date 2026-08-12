import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

/**
 * Layout raíz — solo el documento, las fuentes y los estilos base.
 *
 * A propósito NO trae header, footer ni CTA de WhatsApp: eso es chrome del
 * sitio público y vive en app/(sitio)/layout.tsx. El panel (/login, /panel,
 * /mi-progreso) cuelga de este mismo raíz pero sin nada de eso.
 */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Despertarmente",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
