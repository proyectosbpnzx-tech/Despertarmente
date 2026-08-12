-- Despertarmente — separación explícita en dos paneles.
--
--   PANEL DE STAFF   (/panel)        → roles 'admin' y 'profesor'
--   PANEL DE SOCIO   (/mi-progreso)  → rol  'socio'
--
-- El profesor es personal del centro: carga el progreso de los socios
-- (asistencia, rutinas, mediciones) pero NO administra cuentas ni catálogo.
-- Esa frontera se define acá, en la base — la UI solo la refleja.
--
-- Correr una sola vez en el SQL Editor de Supabase, después de 0001_init.sql.

-- ==========================================================================
-- 1) profiles.role — se suma 'profesor'.
-- ==========================================================================
alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'profesor', 'socio'));

-- ==========================================================================
-- 2) Predicados de rol.
--
--    is_admin()  — puede todo (ya existía en 0001).
--    is_staff()  — admin O profesor: quién ve y carga progreso ajeno.
--
--    Ambas son security definer para no recursar sobre las policies de
--    profiles (la policy de profiles consulta profiles).
-- ==========================================================================
create or replace function public.is_staff()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'profesor')
  );
$$;

-- ==========================================================================
-- 3) Alta de cuentas — el trigger acepta el rol nuevo.
--
--    Se valida contra la lista blanca: un rol desconocido en el metadata
--    cae a 'socio' (el mínimo privilegio) en vez de romper el insert.
-- ==========================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text := new.raw_user_meta_data ->> 'role';
begin
  insert into public.profiles (id, role, full_name, phone)
  values (
    new.id,
    case when requested_role in ('admin', 'profesor', 'socio')
         then requested_role
         else 'socio'
    end,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

-- ==========================================================================
-- 4) profesores — la ficha del catálogo se puede vincular a una cuenta.
--
--    Se mantienen separados a propósito: una ficha existe sin cuenta (el
--    profesor figura en la grilla de clases pero no entra al panel), y se
--    vincula recién cuando el admin le da acceso.
-- ==========================================================================
alter table public.profesores
  add column if not exists profile_id uuid unique references public.profiles (id) on delete set null;

-- ==========================================================================
-- 5) RLS — se reescriben las policies afectadas por el rol nuevo.
-- ==========================================================================

-- profiles: cada uno se ve a sí mismo; el admin ve todo; el profesor ve
-- únicamente los socios (no ve al admin ni a los otros profesores).
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_staff" on public.profiles
  for select using (
    id = auth.uid()
    or public.is_admin()
    or (public.is_staff() and role = 'socio')
  );

-- profesores y clases: el catálogo lo lee cualquiera logueado, pero lo
-- escribe SOLO el admin — el profesor no se edita a sí mismo ni toca la
-- grilla. Las policies de 0001 ya dicen esto; se dejan como están.

-- Progreso del socio: el socio lee lo suyo, el staff lee y escribe todo.
-- El socio nunca escribe su propio progreso.
drop policy if exists "clases_tomadas_select_own_or_admin" on public.clases_tomadas;
drop policy if exists "clases_tomadas_write_admin" on public.clases_tomadas;
create policy "clases_tomadas_select_own_or_staff" on public.clases_tomadas
  for select using (socio_id = auth.uid() or public.is_staff());
create policy "clases_tomadas_write_staff" on public.clases_tomadas
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "rutinas_select_own_or_admin" on public.rutinas;
drop policy if exists "rutinas_write_admin" on public.rutinas;
create policy "rutinas_select_own_or_staff" on public.rutinas
  for select using (socio_id = auth.uid() or public.is_staff());
create policy "rutinas_write_staff" on public.rutinas
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "mediciones_select_own_or_admin" on public.mediciones;
drop policy if exists "mediciones_write_admin" on public.mediciones;
create policy "mediciones_select_own_or_staff" on public.mediciones
  for select using (socio_id = auth.uid() or public.is_staff());
create policy "mediciones_write_staff" on public.mediciones
  for all to authenticated using (public.is_staff()) with check (public.is_staff());
