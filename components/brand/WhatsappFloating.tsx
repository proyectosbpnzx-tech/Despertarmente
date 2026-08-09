import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsappIcon } from "@/components/brand/WhatsappIcon";

/**
 * Ícono de WhatsApp fijo (bottom-right), visible en todo momento durante el
 * scroll. Único punto de conversión de la landing.
 * Se omite si todavía no hay número real cargado en content/site.ts.
 */
export function WhatsappFloating() {
  const href = whatsappUrl();
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-cta text-on-cta shadow-[var(--shadow-glow)] transition-transform hover:brightness-110 active:scale-95"
    >
      <WhatsappIcon className="h-7 w-7" />
    </a>
  );
}
