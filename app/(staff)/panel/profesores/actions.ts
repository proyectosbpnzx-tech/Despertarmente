"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { generateTempPassword } from "@/lib/passwords";

// El catálogo de profesores y el acceso al panel son administración pura:
// todas las acciones de este archivo son exclusivas del admin.

export interface CreateProfesorState {
  error?: string;
  /** Presente solo si además se le creó la cuenta de acceso. */
  success?: boolean | { email: string; tempPassword: string };
}

/**
 * Crea una cuenta con rol 'profesor' y devuelve su clave temporal.
 * El profile lo inserta el trigger handle_new_user a partir del metadata.
 */
async function crearCuentaProfesor(email: string, fullName: string, phone: string) {
  const admin = createAdminClient();
  const tempPassword = generateTempPassword();

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: fullName, phone, role: "profesor" },
  });

  if (error || !data.user) {
    return { error: error?.message ?? "No se pudo crear la cuenta." };
  }

  return { userId: data.user.id, tempPassword };
}

export async function createProfesor(
  _prevState: CreateProfesorState,
  formData: FormData
): Promise<CreateProfesorState> {
  await requireAdmin();

  const nombreCompleto = String(formData.get("nombre_completo") ?? "").trim();
  const especialidad = String(formData.get("especialidad") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!nombreCompleto) {
    return { error: "El nombre es obligatorio." };
  }

  // El email es opcional: una ficha sin cuenta figura en la grilla de clases
  // pero no entra al panel.
  let cuenta: { userId: string; tempPassword: string } | null = null;
  if (email) {
    const resultado = await crearCuentaProfesor(email, nombreCompleto, telefono);
    if ("error" in resultado) {
      return { error: resultado.error };
    }
    cuenta = resultado;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("profesores").insert({
    nombre_completo: nombreCompleto,
    especialidad: especialidad || null,
    telefono: telefono || null,
    profile_id: cuenta?.userId ?? null,
  });

  if (error) {
    // La ficha falló pero la cuenta ya existe: se borra para no dejar un
    // acceso huérfano sin ficha asociada.
    if (cuenta) {
      await createAdminClient().auth.admin.deleteUser(cuenta.userId);
    }
    return { error: error.message };
  }

  revalidatePath("/panel/profesores");
  return { success: cuenta ? { email, tempPassword: cuenta.tempPassword } : true };
}

export interface DarAccesoState {
  error?: string;
  success?: { email: string; tempPassword: string };
}

/** Le da acceso al panel a una ficha de profesor que todavía no tiene cuenta. */
export async function darAccesoProfesor(
  profesorId: string,
  _prevState: DarAccesoState,
  formData: FormData
): Promise<DarAccesoState> {
  await requireAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) {
    return { error: "Ingresá un email." };
  }

  const supabase = await createClient();
  const { data: profesor } = await supabase
    .from("profesores")
    .select("id, nombre_completo, telefono, profile_id")
    .eq("id", profesorId)
    .single<{ id: string; nombre_completo: string; telefono: string | null; profile_id: string | null }>();

  if (!profesor) {
    return { error: "No se encontró la ficha del profesor." };
  }
  if (profesor.profile_id) {
    return { error: "Este profesor ya tiene acceso al panel." };
  }

  const cuenta = await crearCuentaProfesor(email, profesor.nombre_completo, profesor.telefono ?? "");
  if ("error" in cuenta) {
    return { error: cuenta.error };
  }

  const { error } = await supabase
    .from("profesores")
    .update({ profile_id: cuenta.userId })
    .eq("id", profesorId);

  if (error) {
    await createAdminClient().auth.admin.deleteUser(cuenta.userId);
    return { error: error.message };
  }

  revalidatePath("/panel/profesores");
  return { success: { email, tempPassword: cuenta.tempPassword } };
}

export async function toggleProfesorActivo(id: string, activo: boolean) {
  await requireAdmin();

  const supabase = await createClient();
  await supabase.from("profesores").update({ activo }).eq("id", id);
  revalidatePath("/panel/profesores");
  revalidatePath("/panel/clases");
}
