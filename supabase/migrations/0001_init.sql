-- Despertarmente — schema inicial del panel de socios.
-- Correr una sola vez en el SQL Editor de Supabase (o via `supabase db push`).

-- ==========================================================================
-- 1) profiles — 1:1 con auth.users, define el rol de cada cuenta.
-- ==========================================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'socio' check (role in ('admin', 'socio')),
  full_name text,
  phone text,
  must_change_password boolean not null default true,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- Crea el profile automáticamente cuando se crea un auth.users
-- (admin.createUser pasa full_name/phone/role via user_metadata).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'socio'),
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Evita recursión en las policies de profiles.
create function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ==========================================================================
-- 2) Catálogo — profesores y clases.
-- ==========================================================================
create table public.profesores (
  id uuid primary key default gen_random_uuid(),
  nombre_completo text not null,
  telefono text,
  especialidad text,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.clases (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  profesor_id uuid references public.profesores (id),
  dia_semana text check (
    dia_semana in ('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo')
  ),
  horario text,
  cupo integer,
  activa boolean not null default true,
  created_at timestamptz not null default now()
);

-- ==========================================================================
-- 3) Progreso del socio — asistencia, rutinas, mediciones.
-- ==========================================================================
create table public.clases_tomadas (
  id uuid primary key default gen_random_uuid(),
  socio_id uuid not null references public.profiles (id),
  clase_id uuid not null references public.clases (id),
  fecha date not null default current_date,
  presente boolean not null default true,
  notas text,
  registrado_por uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table public.rutinas (
  id uuid primary key default gen_random_uuid(),
  socio_id uuid not null references public.profiles (id),
  nombre text not null,
  descripcion text,
  -- [{ nombre, series, reps, descanso, notas }]
  ejercicios jsonb not null default '[]'::jsonb,
  asignada_por uuid references public.profiles (id),
  fecha_inicio date not null default current_date,
  activa boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mediciones (
  id uuid primary key default gen_random_uuid(),
  socio_id uuid not null references public.profiles (id),
  fecha date not null default current_date,
  peso_kg numeric(5, 2),
  grasa_corporal_pct numeric(4, 1),
  -- { cintura_cm, cadera_cm, brazo_cm, ... } — varía por socio
  medidas jsonb not null default '{}'::jsonb,
  notas text,
  registrado_por uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

-- ==========================================================================
-- 4) Row Level Security
-- ==========================================================================
alter table public.profiles enable row level security;
alter table public.profesores enable row level security;
alter table public.clases enable row level security;
alter table public.clases_tomadas enable row level security;
alter table public.rutinas enable row level security;
alter table public.mediciones enable row level security;

-- profiles: cada uno lee su propia fila, el admin lee todas.
-- Sin policy de insert/update/delete: esas mutaciones solo pasan por el
-- cliente con service-role key (ver lib/supabase/admin.ts).
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

-- profesores / clases: catálogo visible para cualquier usuario logueado,
-- solo el admin escribe.
create policy "profesores_select_authenticated" on public.profesores
  for select to authenticated using (true);
create policy "profesores_write_admin" on public.profesores
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "clases_select_authenticated" on public.clases
  for select to authenticated using (true);
create policy "clases_write_admin" on public.clases
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- clases_tomadas / rutinas / mediciones: el socio ve solo lo suyo, el admin
-- ve y escribe todo (el socio nunca escribe su propio progreso).
create policy "clases_tomadas_select_own_or_admin" on public.clases_tomadas
  for select using (socio_id = auth.uid() or public.is_admin());
create policy "clases_tomadas_write_admin" on public.clases_tomadas
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "rutinas_select_own_or_admin" on public.rutinas
  for select using (socio_id = auth.uid() or public.is_admin());
create policy "rutinas_write_admin" on public.rutinas
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "mediciones_select_own_or_admin" on public.mediciones
  for select using (socio_id = auth.uid() or public.is_admin());
create policy "mediciones_write_admin" on public.mediciones
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ==========================================================================
-- 5) Primer admin — reemplazar el email antes de correr esta línea.
--    (Crear el usuario primero desde Authentication → Users en el dashboard
--    de Supabase, o via signup, y después promoverlo a admin acá.)
-- ==========================================================================
-- update public.profiles set role = 'admin' where id = (
--   select id from auth.users where email = 'admin@despertarmente.com.ar'
-- );
