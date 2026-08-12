import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Se genera en build: no depende de la request.
export const dynamic = "force-static";

/** Solo rutas públicas. El panel se excluye en robots.ts y con noindex. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    // Fase 2: agregar { url: `${site.url}/clubes` } al publicar /clubes.
  ];
}
