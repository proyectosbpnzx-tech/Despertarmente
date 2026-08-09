import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Requerido para generar el archivo con output: 'export'.
export const dynamic = "force-static";

/** robots.txt estático (compatible con output: 'export'). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
