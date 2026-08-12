import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const projectRoot = dirname(fileURLToPath(import.meta.url));

/**
 * App única: sitio institucional (/) + panel de socios (/login, /panel,
 * /mi-progreso) en el mismo deploy y el mismo dominio.
 *
 * Sin `output: "export"`: el panel necesita servidor (middleware, cookies,
 * Server Actions). Las páginas del sitio no consultan nada dinámico, así que
 * Next las prerenderiza igual en el build y se sirven desde la CDN.
 *
 * Sin `trailingSlash`: existía para que el export estático generara rutas
 * predecibles. Ya no hay export, y con trailing slash las rutas del panel
 * pagarían un 308 extra en cada redirect de auth.
 */
const nextConfig = {
  // Fija la raíz al proyecto (hay otro lockfile en el home del usuario).
  outputFileTracingRoot: projectRoot,
  // Se mantiene sin optimizar para no cambiar cómo se ven las imágenes en
  // este refactor. Activarlo es una mejora aparte.
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
