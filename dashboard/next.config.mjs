import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // App independiente en modo servidor (auth, cookies, Server Actions).
  // No usar output: "export" acá — eso es exclusivo del sitio raíz.
  outputFileTracingRoot: projectRoot,
  reactStrictMode: true,
};

export default nextConfig;
