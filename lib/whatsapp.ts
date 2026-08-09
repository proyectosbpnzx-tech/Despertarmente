import { site } from "@/content/site";

/**
 * Arma el link wa.me con mensaje pre-cargado.
 * Si todavía no hay número real cargado en site.ts, devuelve null: los CTA
 * pueden usar esto para mostrarse deshabilitados/con aviso en vez de romper.
 */
export function whatsappUrl(message?: string): string | null {
  const numero = site.whatsappNumber.replace(/\D/g, "");
  if (!numero) return null;

  const texto = (message ?? site.whatsappDefaultMessage).trim();
  const query = texto ? `?text=${encodeURIComponent(texto)}` : "";
  return `https://wa.me/${numero}${query}`;
}

/** true si hay un número de WhatsApp configurado. */
export const whatsappDisponible = (): boolean =>
  site.whatsappNumber.replace(/\D/g, "").length > 0;
