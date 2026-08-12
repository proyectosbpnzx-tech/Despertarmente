# Despertarmente — Panel

App separada de la landing (deploy propio). Next.js App Router + Supabase (auth + Postgres con RLS).

## Los dos paneles

La app está partida en dos, por rol:

| | **Panel de staff** | **Panel de socio** |
|---|---|---|
| Ruta | `/panel/*` | `/mi-progreso/*` |
| Roles | `admin`, `profesor` | `socio` |
| Route group | `app/(staff)/` | `app/(member)/` |
| Qué hace | carga y administra | consulta lo suyo |

`/login` es la única puerta compartida; `/` redirige a cada uno a su panel según el rol.
**El socio nunca escribe su propio progreso** — lo carga el staff.

## Quién puede qué

| Acción | admin | profesor | socio |
|---|:--:|:--:|:--:|
| Ver su propio progreso | — | — | ✅ |
| Ver la lista de socios y sus fichas | ✅ | ✅ | ❌ |
| Registrar asistencia | ✅ | ✅ | ❌ |
| Asignar rutinas | ✅ | ✅ | ❌ |
| Cargar mediciones | ✅ | ✅ | ❌ |
| Ver la grilla de clases | ✅ | ✅ | ❌ |
| Crear / desactivar clases | ✅ | ❌ | ❌ |
| Fichas de profesores | ✅ | ❌ | ❌ |
| Alta de cuentas y accesos | ✅ | ❌ | ❌ |

## Dónde se hace cumplir

Tres capas, de adentro hacia afuera:

1. **RLS en Postgres** (`supabase/migrations/`) — la única que importa. Los predicados
   `is_admin()` e `is_staff()` definen la frontera; sin ellos no se lee ni escribe nada ajeno.
2. **Guards de la app** (`lib/auth.ts`) — `requireStaff()`, `requireAdmin()`, `requireSocio()`.
   Evitan que alguien *vea* una pantalla que no le toca y lo mandan a su panel.
3. **UI condicional** — los links y formularios de admin no se renderizan para el profesor.
   Es cortesía, no seguridad.

⚠️ **El cliente service-role (`lib/supabase/admin.ts`) bypassea RLS.** Un Server Action es un
endpoint POST invocable por cualquier usuario logueado: toda acción que use ese cliente
**debe** empezar con `await requireAdmin()`. El gateo del layout no alcanza.

## Profesores: ficha ≠ cuenta

Están separados a propósito:

- **Ficha** (`public.profesores`) — figura en la grilla de clases. No implica acceso.
- **Cuenta** (`auth.users` + `profiles.role = 'profesor'`) — entra al panel de staff.

Se vinculan por `profesores.profile_id`. Un profesor puede tener ficha sin cuenta (aparece en
la grilla pero no entra), y el admin le da acceso después desde `/panel/profesores`.

## Correr el proyecto

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

Variables en `.env.local` (ver `.env.example`). `SUPABASE_SERVICE_ROLE_KEY` es secreta:
nunca se expone al cliente — el import `server-only` hace fallar el build si eso pasa.

## Migraciones

Correr en orden en el SQL Editor de Supabase:

| Archivo | Qué hace |
|---|---|
| `0001_init.sql` | Schema inicial, roles `admin`/`socio`, RLS |
| `0002_rol_profesor.sql` | Suma el rol `profesor`, `is_staff()`, `profesores.profile_id`, reescribe RLS |

El primer admin se promueve a mano (ver el final de `0001_init.sql`).
