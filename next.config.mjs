import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fija la raíz al proyecto (hay otro lockfile en el home del usuario).
  outputFileTracingRoot: projectRoot,
  // Static export para deploy en Vercel como sitio estático.
  output: "export",
  // Requerido con output: 'export' — no hay servidor de optimización de imágenes.
  images: { unoptimized: true },
  // URLs con trailing slash → rutas estáticas más predecibles en hosting estático.
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
