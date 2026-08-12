import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Role } from "@/lib/types";

/**
 * Frontera entre los dos paneles. Es la única fuente de verdad del lado de
 * la app: layouts, páginas y Server Actions importan de acá.
 *
 *   PANEL DE STAFF   /panel        → admin, profesor
 *   PANEL DE SOCIO   /mi-progreso  → socio
 *
 * Ojo: esto es la puerta de calle, no la cerradura. Lo que realmente impide
 * leer o escribir datos ajenos son las policies de RLS (ver
 * supabase/migrations). Los guards de acá evitan que alguien *vea* una
 * pantalla que no le corresponde; la excepción es el cliente service-role
 * (lib/supabase/admin.ts), que bypassea RLS y por eso exige requireAdmin()
 * explícito en toda acción que lo use.
 */

export type SessionProfile = Pick<Profile, "id" | "role" | "full_name" | "must_change_password">;

export const STAFF_HOME = "/panel";
export const SOCIO_HOME = "/mi-progreso";

export function isStaff(role: Role): boolean {
  return role === "admin" || role === "profesor";
}

/** Panel que le corresponde a un rol. Se usa para mandar a cada uno a su lado. */
export function panelHome(role: Role): string {
  return isStaff(role) ? STAFF_HOME : SOCIO_HOME;
}

/** Perfil de la sesión actual, o null si no hay sesión. No redirige. */
export async function getSessionProfile(): Promise<SessionProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, full_name, must_change_password")
    .eq("id", user.id)
    .single<SessionProfile>();

  return profile ?? null;
}

/** Exige sesión con perfil y contraseña ya definida. */
async function requireProfile(): Promise<SessionProfile> {
  const profile = await getSessionProfile();

  if (!profile) {
    redirect("/login");
  }
  if (profile.must_change_password) {
    redirect("/cambiar-clave");
  }

  return profile;
}

/** Panel de staff: admin o profesor. Al socio lo manda a su panel. */
export async function requireStaff(): Promise<SessionProfile> {
  const profile = await requireProfile();

  if (!isStaff(profile.role)) {
    redirect(SOCIO_HOME);
  }

  return profile;
}

/**
 * Solo admin: alta y baja de cuentas, catálogo de profesores, grilla de
 * clases. Obligatorio en toda acción que use el cliente service-role.
 */
export async function requireAdmin(): Promise<SessionProfile> {
  const profile = await requireProfile();

  if (profile.role !== "admin") {
    redirect(panelHome(profile.role));
  }

  return profile;
}

/** Panel de socio. Al staff lo manda a su panel. */
export async function requireSocio(): Promise<SessionProfile> {
  const profile = await requireProfile();

  if (profile.role !== "socio") {
    redirect(STAFF_HOME);
  }

  return profile;
}
