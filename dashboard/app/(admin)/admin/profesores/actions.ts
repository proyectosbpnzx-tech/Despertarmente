"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface CreateProfesorState {
  error?: string;
  success?: boolean;
}

export async function createProfesor(
  _prevState: CreateProfesorState,
  formData: FormData
): Promise<CreateProfesorState> {
  const nombreCompleto = String(formData.get("nombre_completo") ?? "").trim();
  const especialidad = String(formData.get("especialidad") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();

  if (!nombreCompleto) {
    return { error: "El nombre es obligatorio." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("profesores").insert({
    nombre_completo: nombreCompleto,
    especialidad: especialidad || null,
    telefono: telefono || null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/profesores");
  return { success: true };
}

export async function toggleProfesorActivo(id: string, activo: boolean) {
  const supabase = await createClient();
  await supabase.from("profesores").update({ activo }).eq("id", id);
  revalidatePath("/admin/profesores");
  revalidatePath("/admin/clases");
}
