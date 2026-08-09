---
name: seo-local-ar
description: SEO local para Argentina en Despertarmente. JSON-LD (LocalBusiness/SportsActivityLocation), consistencia NAP, metadata en es-AR.
---

# SEO local (Argentina)

Objetivo: que Despertarmente aparezca para búsquedas locales (General Rodríguez / zona oeste
del GBA) de neurociencia / preparación mental / rendimiento deportivo.

## NAP consistente (Name, Address, Phone)

- Fuente **única** de NAP: `content/site.ts`. Footer, JSON-LD y metadata leen de ahí.
- Nombre canónico exacto: **Despertarmente**. Bajada: "Neurociencia aplicada al deporte".
- El teléfono/WhatsApp, dirección/zona y horarios deben ser idénticos en toda aparición.
  Donde falten datos reales → `[[PENDIENTE]]`, no inventar dirección ni teléfono.

## Metadata

- `lang="es-AR"`. `<title>` y `<meta description>` con la propuesta de valor + localidad
  ("General Rodríguez, Buenos Aires").
- Open Graph + Twitter Card: título, descripción, imagen OG ([[PENDIENTE]] hasta tener el asset).
- `canonical` absoluto. `metadataBase` seteado en el layout.

## JSON-LD (datos estructurados)

- Tipo: `LocalBusiness` (o `SportsActivityLocation`, subtipo apropiado) en `lib/seo.ts`.
- Campos: `name`, `description`, `url`, `image`, `address` (PostalAddress con
  `addressLocality`, `addressRegion: "Buenos Aires"`, `addressCountry: "AR"`),
  `telephone`, `sameAs` (Instagram y notas de prensa), `founder`/`employee` (Jonatan Rodríguez),
  `areaServed`, `openingHours`.
- Emitir solo campos con datos reales. Omitir (no falsear) los que estén `[[PENDIENTE]]`.
- Validar con Rich Results Test antes de dar por cerrado.

## Contenido

- Encabezados con intención local y de servicio, sin keyword stuffing.
- URLs limpias y estables. Sitemap y robots estáticos (compatibles con `output: 'export'`).
