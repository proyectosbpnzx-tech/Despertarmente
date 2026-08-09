"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Ejercicio, Medida } from "@/lib/types";

export interface RegistrarClaseTomadaState {
  error?: string;
  success?: boolean;
}

export async function registrarClaseTomada(
  socioId: string,
  _prevState: RegistrarClaseTomadaState,
  formData: FormData
): Promise<RegistrarClaseTomadaState> {
  const claseId = String(formData.get("clase_id") ?? "").trim();
  const fecha = String(formData.get("fecha") ?? "").trim();
  const presente = formData.get("presente") === "on";
  const notas = String(formData.get("notas") ?? "").trim();

  if (!claseId || !fecha) {
    return { error: "Elegí una clase y una fecha." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("clases_tomadas").insert({
    socio_id: socioId,
    clase_id: claseId,
    fecha,
    presente,
    notas: notas || null,
    registrado_por: user?.id ?? null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/socios/${socioId}`);
  return { success: true };
}

export async function eliminarClaseTomada(socioId: string, id: string) {
  const supabase = await createClient();
  await supabase.from("clases_tomadas").delete().eq("id", id);
  revalidatePath(`/admin/socios/${socioId}`);
}

export interface AsignarRutinaState {
  error?: string;
  success?: boolean;
}

export async function asignarRutina(
  socioId: string,
  _prevState: AsignarRutinaState,
  formData: FormData
): Promise<AsignarRutinaState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const fechaInicio = String(formData.get("fecha_inicio") ?? "").trim();
  const ejerciciosRaw = String(formData.get("ejercicios_json") ?? "[]");

  if (!nombre || !fechaInicio) {
    return { error: "Nombre y fecha de inicio son obligatorios." };
  }

  let ejercicios: Ejercicio[];
  try {
    ejercicios = (JSON.parse(ejerciciosRaw) as Ejercicio[]).filter((e) => e.nombre?.trim());
  } catch {
    return { error: "Los ejercicios cargados no son válidos." };
  }

  if (ejercicios.length === 0) {
    return { error: "Agregá al menos un ejercicio con nombre." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("rutinas").insert({
    socio_id: socioId,
    nombre,
    descripcion: descripcion || null,
    ejercicios,
    fecha_inicio: fechaInicio,
    asignada_por: user?.id ?? null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/socios/${socioId}`);
  return { success: true };
}

export async function toggleRutinaActiva(socioId: string, id: string, activa: boolean) {
  const supabase = await createClient();
  await supabase.from("rutinas").update({ activa }).eq("id", id);
  revalidatePath(`/admin/socios/${socioId}`);
}

export interface RegistrarMedicionState {
  error?: string;
  success?: boolean;
}

function parseNumeroOpcional(raw: string): number | null | undefined {
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

export async function registrarMedicion(
  socioId: string,
  _prevState: RegistrarMedicionState,
  formData: FormData
): Promise<RegistrarMedicionState> {
  const fecha = String(formData.get("fecha") ?? "").trim();
  const pesoRaw = String(formData.get("peso_kg") ?? "").trim();
  const grasaRaw = String(formData.get("grasa_corporal_pct") ?? "").trim();
  const notas = String(formData.get("notas") ?? "").trim();
  const medidasRaw = String(formData.get("medidas_json") ?? "[]");

  if (!fecha) {
    return { error: "La fecha es obligatoria." };
  }

  const pesoKg = parseNumeroOpcional(pesoRaw);
  const grasaPct = parseNumeroOpcional(grasaRaw);
  if (pesoKg === undefined || grasaPct === undefined) {
    return { error: "Peso y grasa corporal tienen que ser números." };
  }

  let medidas: Medida[];
  try {
    medidas = (JSON.parse(medidasRaw) as Medida[]).filter((m) => m.nombre?.trim() && m.valor?.trim());
  } catch {
    return { error: "Las medidas cargadas no son válidas." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("mediciones").insert({
    socio_id: socioId,
    fecha,
    peso_kg: pesoKg,
    grasa_corporal_pct: grasaPct,
    medidas,
    notas: notas || null,
    registrado_por: user?.id ?? null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/socios/${socioId}`);
  return { success: true };
}

export async function eliminarMedicion(socioId: string, id: string) {
  const supabase = await createClient();
  await supabase.from("mediciones").delete().eq("id", id);
  revalidatePath(`/admin/socios/${socioId}`);
}
