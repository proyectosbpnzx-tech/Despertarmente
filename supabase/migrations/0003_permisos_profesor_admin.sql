-- Despertarmente — separa quién carga el día a día (profesor) de quién
-- administra y supervisa (admin), y suma la inscripción de un socio a una
-- clase.
--
--   PROFESOR — carga el día a día: asistencia (clases_tomadas), rutinas,
--              y el ALTA de mediciones.
--   ADMIN    — sigue siendo dueño del catálogo (profesores, clases) y de
--              las cuentas; además corrige/borra mediciones (supervisión)
--              e inscribe socios a una clase (asignación de horario fijo,
--              distinta de la asistencia puntual de clases_tomadas).
--
-- Hasta acá, "staff" (admin o profesor) escribía todo por igual en
-- clases_tomadas / rutinas / mediciones. Esta migración separa la
-- escritura por rol y, en mediciones, por comando (insert vs update/delete)
-- — RLS sigue siendo la única capa que importa; la UI y los guards de
-- lib/auth.ts solo reflejan esta frontera.
--
-- Correr una sola vez en el SQL Editor de Supabase, después de
-- 0002_rol_profesor.sql.

-- ==========================================================================
-- 1) is_profesor() — mismo patrón que is_admin() (0001) e is_staff() (0002):
--    security definer para no recursar sobre las policies de profiles.
-- ==========================================================================
create or replace function public.is_profesor()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'profesor'
  );
$$;

-- ==========================================================================
-- 2) inscripciones — asignación de un socio a una clase (horario fijo).
--    Distinta de clases_tomadas, que es el registro de asistencia por
--    sesión. La arma el admin al organizar la agenda; el profesor la ve
--    (sabe quién va a venir) pero no la edita.
-- ==========================================================================
create table public.inscripciones (
  id uuid primary key default gen_random_uuid(),
  socio_id uuid not null references public.profiles (id) on delete cascade,
  clase_id uuid not null references public.clases (id) on delete cascade,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  unique (socio_id, clase_id)
);

alter table public.inscripciones enable row level security;

-- Igual que clases_tomadas/rutinas/mediciones: el socio ve solo lo suyo, el
-- staff (admin + profesor) ve todo. Solo el admin escribe.
create policy "inscripciones_select_own_or_staff" on public.inscripciones
  for select using (socio_id = auth.uid() or public.is_staff());
create policy "inscripciones_write_admin" on public.inscripciones
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ==========================================================================
-- 3) clases_tomadas / rutinas — pasan de "escribe todo el staff" a
--    "escribe solo el profesor". El admin sigue viendo todo (la policy de
--    select de 0002 ya cubre is_staff()); administra cuentas y catálogo,
--    ya no carga el día a día de un socio.
-- ==========================================================================
drop policy if exists "clases_tomadas_write_staff" on public.clases_tomadas;
create policy "clases_tomadas_write_profesor" on public.clases_tomadas
  for all to authenticated using (public.is_profesor()) with check (public.is_profesor());

drop policy if exists "rutinas_write_staff" on public.rutinas;
create policy "rutinas_write_profesor" on public.rutinas
  for all to authenticated using (public.is_profesor()) with check (public.is_profesor());

-- ==========================================================================
-- 4) mediciones — se separa por comando: el profesor CARGA (insert), el
--    admin CORRIGE Y BORRA (update/delete). Es la supervisión: una vez que
--    el profesor la registró, no la puede tocar; si hay un error, lo
--    corrige el admin.
-- ==========================================================================
drop policy if exists "mediciones_write_staff" on public.mediciones;

create policy "mediciones_insert_profesor" on public.mediciones
  for insert to authenticated with check (public.is_profesor());

create policy "mediciones_update_admin" on public.mediciones
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "mediciones_delete_admin" on public.mediciones
  for delete to authenticated using (public.is_admin());
