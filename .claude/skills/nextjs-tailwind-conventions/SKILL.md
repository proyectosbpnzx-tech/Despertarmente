---
name: nextjs-tailwind-conventions
description: Convenciones de Next.js (App Router) + Tailwind v4 + TypeScript para Despertarmente. Static export, mobile-first, contenido separado de presentación.
---

# Convenciones Next.js + Tailwind

## Arquitectura

- **App Router** + TypeScript estricto. Static export (`output: 'export'`) — sin código que
  requiera servidor en runtime (nada de route handlers dinámicos, `cookies()`, ISR, etc.).
- **Server Components por defecto.** `"use client"` solo cuando hay estado/eventos del navegador
  (ej. menú mobile, scroll). Mantener el JS del cliente al mínimo.
- **Contenido separado de presentación.** Los componentes de `sections/` no tienen copy
  hardcodeado: reciben datos tipados desde `content/*.ts`. Esto habilita Fase 2 (`/clubes`)
  sin refactor: misma UI, otro módulo de contenido con el mismo tipo.
- Alias de import `@/*` desde la raíz.

## Mobile-first (en serio)

- El tráfico viene de Instagram en celular. Diseñá y escribí CSS mobile-first: los estilos base
  son para mobile; usá `sm:`/`md:`/`lg:` para agrandar, nunca al revés.
- Probar primero en 360–390px de ancho. Sin scroll horizontal. Tap targets ≥44px.

## Estilos

- Tailwind v4 con config CSS-first. Utilidades **semánticas** desde tokens (ver `brand-tokens`).
  Prohibido hardcodear color/fuente en clases (`bg-[#...]`, `text-blue-500`).
- Composición de clases larga → extraer a componente, no a `@apply` salvo casos base globales.

## Componentes

- Un componente por archivo, PascalCase. Props tipadas con `interface`/`type` explícito.
- `ui/` = primitivos reutilizables (Container, Section). `sections/` = bloques de la landing.
  `brand/` = Logo y CTA. `layout/` = Header/Footer.
- Imágenes con `next/image` y `unoptimized` (por el export); siempre `alt`.

## Calidad

- `npm run build` debe pasar limpio y generar `out/`. Sin `any` innecesarios.
- Respetar las skills `a11y-wcag`, `copy-es-ar`, `seo-local-ar`, `brand-tokens`.
