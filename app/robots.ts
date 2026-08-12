import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Se genera en build: no depende de la request.
export const dynamic = "force-static";

/**
 * El panel comparte dominio con el sitio, así que hay que excluirlo a mano.
 * Las páginas privadas además mandan `robots: noindex` en su metadata; esto
 * es la otra mitad, para que los crawlers ni siquiera las pidan.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/login", "/cambiar-clave", "/panel/", "/mi-progreso/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
