import type { Metadata } from "next";
import { site } from "@/content/site";
import { esPendiente } from "@/content/types";

const DESCRIPTION =
  "Entrenamiento mental para deportistas en General Rodríguez, Buenos Aires. " +
  "Concentración, manejo de la presión y confianza, con neurociencia aplicada al deporte. Dirige Jonatan Rodríguez.";

/** Valor utilizable = no vacío y no marcador [[PENDIENTE]]. */
const usable = (v?: string): v is string =>
  !!v && v.trim().length > 0 && !esPendiente(v);

/** Metadata base del sitio (leída desde la fuente única `site`). */
export function buildMetadata(): Metadata {
  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${site.tagline}`,
      template: `%s — ${site.name}`,
    },
    description: DESCRIPTION,
    applicationName: site.name,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "es_AR",
      siteName: site.name,
      title: `${site.name} — ${site.tagline}`,
      description: DESCRIPTION,
      url: site.url,
      // images: [{ url: "/og.jpg" }], // [[PENDIENTE: imagen Open Graph]]
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} — ${site.tagline}`,
      description: DESCRIPTION,
    },
    robots: { index: true, follow: true },
  };
}

/**
 * JSON-LD LocalBusiness / SportsActivityLocation.
 * Emite SOLO campos con datos reales; omite (no falsea) los pendientes.
 */
export function jsonLd(): Record<string, unknown> {
  const sameAs = [site.instagram.url, site.facebook.url].filter(usable);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "SportsActivityLocation"],
    name: site.name,
    description: DESCRIPTION,
    url: site.url,
    slogan: site.tagline,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.localidad,
      addressRegion: site.region,
      addressCountry: site.pais,
      ...(usable(site.direccion) ? { streetAddress: site.direccion } : {}),
    },
    areaServed: `${site.localidad}, ${site.region}`,
    founder: {
      "@type": "Person",
      name: "Jonatan Rodríguez",
      jobTitle: "Director de Despertarmente",
    },
  };

  if (usable(site.whatsappNumber)) {
    data.telephone = `+${site.whatsappNumber.replace(/\D/g, "")}`;
  }
  if (usable(site.horarios)) data.openingHours = site.horarios;
  if (usable(site.email)) data.email = site.email;
  if (sameAs.length) data.sameAs = sameAs;

  return data;
}
