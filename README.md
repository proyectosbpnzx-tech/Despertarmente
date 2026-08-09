# Despertarmente — Landing

Landing institucional de **Despertarmente**, centro de _neurociencia aplicada al deporte_ en
General Rodríguez (Buenos Aires). Dirige Jonatan Rodríguez. Objetivo único de conversión:
que la persona **escriba por WhatsApp**.

- **Stack:** Next.js (App Router) · TypeScript · Tailwind CSS v4 · static export (`output: 'export'`).
- **Deploy:** Vercel (build genera `out/`).
- **Mobile-first:** el tráfico viene de Instagram en celular.

## Correr el proyecto

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # export estático en out/
```

## Estructura

| Carpeta | Qué hay |
|---|---|
| `app/` | layout, page (landing deportistas), sitemap, robots |
| `components/sections/` | bloques de la landing (agnósticos de contenido) |
| `components/brand/` | `Logo` (slot único) y `WhatsappCta` (conversión) |
| `components/ui/` | `Container`, `Section`, `Pendiente` |
| `content/` | **todo el copy y los datos** — `site.ts`, `landing.ts`, `clubes.ts`, `types.ts` |
| `styles/tokens.css` | **única fuente de identidad visual** (colores, tipografías, radios) |
| `lib/` | `whatsapp.ts` (link wa.me) y `seo.ts` (metadata + JSON-LD) |
| `.claude/skills/` | reglas del proyecto (copy, a11y, SEO, tokens, convenciones) |

Principio: **contenido separado de presentación**. Los componentes no tienen copy hardcodeado;
leen de `content/*.ts`. Cambiar textos = editar `content/`, no los componentes.

## Cambiar la identidad visual

Todo sale de `styles/tokens.css` (primitivos → semánticos → utilidades Tailwind).
Cambiar un color/tipografía = editar ese archivo y nada más. No hardcodear colores en componentes.

## El logo

`components/brand/Logo.tsx` es el único punto de integración: ícono real
(`public/logo.jpg`, badge circular) + wordmark tipográfico al lado (el texto
interno del badge no se lee a tamaños chicos, por eso se acompaña del
wordmark). También sirve de favicon vía `app/icon.jpg`.

## Contenido pendiente (`[[PENDIENTE]]`)

La regla es **no inventar**. Los huecos aparecen visibles en la página (componente `Pendiente`)
y como marcadores `[[PENDIENTE: ...]]` en el código. Datos a aportar por Jonatan:

**Contenido**
- Cómo es una sesión: paso a paso, duración, con qué se trabaja → `content/landing.ts › sesion`.
- Servicios: nombre, qué incluye, modalidad y precio/rango → `content/landing.ts › servicios`.
- Testimonios reales (con consentimiento) → `content/landing.ts › testimonios`.
- Descripción concreta del método en palabras de Jonatan → `content/landing.ts › queEs.pendiente`.

**Negocio / SEO (en `content/site.ts`)**
- Horarios de atención (`horarios`).
- URLs exactas de las notas de prensa (La Posta y VDP Noticias) → `content/landing.ts › pruebaSocial`.
- Dominio de producción (`site.url`) y email de contacto (opcional).

**Visuales (en `/public`)**
- Fotos reales: centro, sesiones y retrato de Jonatan.
- Imagen Open Graph (`og.jpg`) → luego destrabar en `lib/seo.ts`.

## Fase 2 — Activar `/clubes` (no construir todavía)

La arquitectura ya está lista: `content/clubes.ts` es un stub que conforma el mismo tipo
`LandingContent`. Para publicar la ruta más adelante, sin refactor:

1. Completar `content/clubes.ts` con datos reales.
2. Crear `app/clubes/page.tsx` importando las **mismas** secciones que `app/page.tsx`, pero con
   `import { clubes } from "@/content/clubes"`.
3. Agregar la URL en `app/sitemap.ts`.

## Accesibilidad y SEO

Se aplican las skills `a11y-wcag` (WCAG 2.2 AA), `seo-local-ar` y `copy-es-ar`. Verificar con
Lighthouse/axe y validar el JSON-LD (Rich Results Test) antes de publicar.
