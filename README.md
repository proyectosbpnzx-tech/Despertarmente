# Despertarmente

Sitio institucional y panel de socios de **Despertarmente**, centro de _neurociencia aplicada
al deporte_ en General Rodríguez (Buenos Aires). Dirige Jonatan Rodríguez.

Una sola app Next.js, un solo dominio, un solo deploy.

- **Stack:** Next.js (App Router) · TypeScript · Tailwind CSS v4 · Supabase (auth + Postgres con RLS).
- **Mobile-first:** el tráfico viene de Instagram en celular.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

Variables en `.env.local` (ver `.env.example`). `SUPABASE_SERVICE_ROLE_KEY` es secreta: nunca se
expone al cliente — el import `server-only` hace fallar el build si eso pasa.

## Las dos mitades

| | **Sitio público** | **Panel** |
|---|---|---|
| Rutas | `/` | `/login`, `/panel/*`, `/mi-progreso/*` |
| Route group | `app/(sitio)/` | `app/(auth)/`, `app/(staff)/`, `app/(member)/` |
| Objetivo | que la persona escriba por WhatsApp | seguimiento de socios |
| Render | prerenderizado en build | servidor, por request |

El layout raíz (`app/layout.tsx`) trae solo el documento y las fuentes. El header, footer y CTA
de WhatsApp viven en `app/(sitio)/layout.tsx`, así que el panel no los hereda.

⚠️ **El matcher de `middleware.ts` lista solo las rutas del panel.** `updateSession` manda al
login a todo visitante sin sesión: si el matcher fuera amplio, cualquiera que entre a la home
terminaría en `/login`. Al agregar rutas privadas, sumalas ahí explícitamente.

## Panel: quién puede qué

Tres roles, dos destinos. `admin` y `profesor` son staff y comparten `/panel`; `socio` tiene
`/mi-progreso`. El socio **nunca** escribe su propio progreso: lo carga el staff.

| Acción | admin | profesor | socio |
|---|:--:|:--:|:--:|
| Ver su propio progreso | — | — | ✅ |
| Ver socios y sus fichas | ✅ | ✅ | ❌ |
| Asistencia, rutinas, mediciones | ✅ | ✅ | ❌ |
| Ver la grilla de clases | ✅ | ✅ | ❌ |
| Crear / desactivar clases | ✅ | ❌ | ❌ |
| Fichas de profesores | ✅ | ❌ | ❌ |
| Alta de cuentas y accesos | ✅ | ❌ | ❌ |

### Dónde se hace cumplir

1. **RLS en Postgres** (`supabase/migrations/`) — la única capa que importa. Los predicados
   `is_admin()` e `is_staff()` definen la frontera.
2. **Guards de la app** (`lib/auth.ts`) — `requireStaff()`, `requireAdmin()`, `requireSocio()`.
   Evitan que alguien *vea* una pantalla que no le toca. Todo redirect apunta a un panel que
   acepta al que llega, nunca "al otro": así un rol inesperado no queda rebotando en un loop.
3. **UI condicional** — los links y formularios de admin no se renderizan para el profesor.
   Es cortesía, no seguridad.

⚠️ **El cliente service-role (`lib/supabase/admin.ts`) bypassea RLS.** Un Server Action es un
endpoint POST invocable por cualquier usuario logueado: toda acción que use ese cliente **debe**
empezar con `await requireAdmin()`. El gateo del layout no alcanza.

### Profesores: ficha ≠ cuenta

- **Ficha** (`public.profesores`) — figura en la grilla de clases. No implica acceso.
- **Cuenta** (`auth.users` + `profiles.role = 'profesor'`) — entra al panel.

Se vinculan por `profesores.profile_id`. El admin da el acceso desde `/panel/profesores`.

### Migraciones

Correr en orden en el SQL Editor de Supabase:

| Archivo | Qué hace |
|---|---|
| `0001_init.sql` | Schema inicial, roles `admin`/`socio`, RLS |
| `0002_rol_profesor.sql` | Rol `profesor`, `is_staff()`, `profesores.profile_id`, reescribe RLS |

El primer admin se promueve a mano (ver el final de `0001_init.sql`).

## Estructura

| Carpeta | Qué hay |
|---|---|
| `app/(sitio)/` | landing y su chrome |
| `app/(auth)/`, `app/(staff)/`, `app/(member)/` | panel |
| `components/sections/` | bloques de la landing (agnósticos de contenido) |
| `components/brand/`, `components/layout/`, `components/ui/` | marca y chrome del sitio |
| `components/panel/` | componentes del panel (`Container` propio, más angosto) |
| `content/` | **todo el copy y los datos** — `site.ts`, `landing.ts`, `clubes.ts` |
| `lib/` | `auth.ts`, `supabase/`, `seo.ts`, `whatsapp.ts`, `types.ts` |
| `styles/tokens.css` | **única fuente de identidad visual** |
| `supabase/migrations/` | schema y RLS |

Principio: **contenido separado de presentación**. Los componentes del sitio no tienen copy
hardcodeado; leen de `content/*.ts`. Cambiar textos = editar `content/`, no los componentes.

Identidad visual: todo sale de `styles/tokens.css` (primitivos → semánticos → utilidades
Tailwind). Cambiar un color o tipografía = editar ese archivo y nada más.

## El logo

`components/brand/Logo.tsx` es el único punto de integración: ícono real (`public/logo.jpg`,
badge circular) + wordmark tipográfico al lado. También sirve de favicon vía `app/icon.jpg`.

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

`content/clubes.ts` es un stub que conforma el mismo tipo `LandingContent`. Para publicar la
ruta más adelante, sin refactor:

1. Completar `content/clubes.ts` con datos reales.
2. Crear `app/(sitio)/clubes/page.tsx` importando las **mismas** secciones que la home, pero con
   `import { clubes } from "@/content/clubes"`.
3. Agregar la URL en `app/sitemap.ts`.

## Accesibilidad y SEO

Se aplican las skills `a11y-wcag` (WCAG 2.2 AA), `seo-local-ar` y `copy-es-ar`. El panel se
excluye de la indexación por dos vías: `app/robots.ts` y `robots: noindex` en sus layouts.
Verificar con Lighthouse/axe y validar el JSON-LD (Rich Results Test) antes de publicar.
