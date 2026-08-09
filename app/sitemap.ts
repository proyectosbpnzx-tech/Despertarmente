import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Requerido para generar el archivo con output: 'export'.
export const dynamic = "force-static";

/** Sitemap estático (compatible con output: 'export'). */
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
