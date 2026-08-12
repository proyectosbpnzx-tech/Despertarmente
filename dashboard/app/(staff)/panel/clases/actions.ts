"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import type { DiaSemana } from "@/lib/types";

const DIAS_VALIDOS: DiaSemana[] = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
];

export interface CreateClaseState {
  error?: string;
  success?: boolean;
}

export async function createClase(
  _prevState: CreateClaseState,
  formData: FormData
): Promise<CreateClaseState> {
  // El catálogo lo administra solo el admin; el profesor lo ve, no lo edita.
  await requireAdmin();

  const nombre = String(formData.get("nombre") ?? "").trim();
  const profesorId = String(formData.get("profesor_id") ?? "").trim();
  const diaSemana = String(formData.get("dia_semana") ?? "").trim();
  const horario = String(formData.get("horario") ?? "").trim();
  const cupoRaw = String(formData.get("cupo") ?? "").trim();

  if (!nombre) {
    return { error: "El nombre de la clase es obligatorio." };
  }

  if (diaSemana && !DIAS_VALIDOS.includes(diaSemana as DiaSemana)) {
    return { error: "Día de la semana inválido." };
  }

  const cupo = cupoRaw ? Number(cupoRaw) : null;
  if (cupo !== null && (!Number.isInteger(cupo) || cupo < 1)) {
    return { error: "El cupo tiene que ser un número entero mayor a 0." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("clases").insert({
    nombre,
    profesor_id: profesorId || null,
    dia_semana: diaSemana || null,
    horario: horario || null,
    cupo,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/panel/clases");
  return { success: true };
}

export async function toggleClaseActiva(id: string, activa: boolean) {
  await requireAdmin();

  const supabase = await createClient();
  await supabase.from("clases").update({ activa }).eq("id", id);
  revalidatePath("/panel/clases");
}
