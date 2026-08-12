import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsappFloating } from "@/components/brand/WhatsappFloating";
import { buildMetadata, jsonLd } from "@/lib/seo";

/**
 * Chrome del sitio público. Todo lo que cuelga de este grupo lleva header,
 * footer, CTA flotante de WhatsApp y los datos estructurados.
 *
 * El panel no pasa por acá: vive en (auth), (staff) y (member), que son
 * hermanos de este grupo y comparten solo el layout raíz.
 */

export const metadata: Metadata = buildMetadata();

export default function SitioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">{children}</main>
      <Footer />
      <WhatsappFloating />
      <script
        type="application/ld+json"
        // Datos estructurados: solo campos reales (ver lib/seo.ts).
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />
    </>
  );
}
