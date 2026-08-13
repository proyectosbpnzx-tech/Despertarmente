"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, requireProfesor } from "@/lib/auth";
import type { Ejercicio, Medida } from "@/lib/types";

// Cargar el día a día de un socio (asistencia, rutinas, alta de mediciones)
// es trabajo del profesor; el admin supervisa: corrige/borra mediciones e
// inscribe socios a una clase. RLS ya lo exige (policies *_write_profesor,
// mediciones_insert_profesor, mediciones_update_admin, mediciones_delete_admin,
// inscripciones_write_admin — ver 0003_permisos_profesor_admin.sql); el guard
// de cada acción lo hace explícito y devuelve a cada rol a su panel en vez de
// un error crudo.

export interface RegistrarClaseTomadaState {
  error?: string;
  success?: boolean;
}

export async function registrarClaseTomada(
  socioId: string,
  _prevState: RegistrarClaseTomadaState,
  formData: FormData
): Promise<RegistrarClaseTomadaState> {
  await requireProfesor();

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

  revalidatePath(`/panel/socios/${socioId}`);
  return { success: true };
}

export async function eliminarClaseTomada(socioId: string, id: string) {
  await requireProfesor();

  const supabase = await createClient();
  await supabase.from("clases_tomadas").delete().eq("id", id);
  revalidatePath(`/panel/socios/${socioId}`);
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
  await requireProfesor();

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

  revalidatePath(`/panel/socios/${socioId}`);
  return { success: true };
}

export async function toggleRutinaActiva(socioId: string, id: string, activa: boolean) {
  await requireProfesor();

  const supabase = await createClient();
  await supabase.from("rutinas").update({ activa }).eq("id", id);
  revalidatePath(`/panel/socios/${socioId}`);
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
  await requireProfesor();

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

  revalidatePath(`/panel/socios/${socioId}`);
  return { success: true };
}

/**
 * Corrección de una medición ya cargada: es supervisión, solo el admin.
 * El profesor la carga (registrarMedicion) pero no la puede tocar después.
 */
export async function actualizarMedicion(
  socioId: string,
  medicionId: string,
  _prevState: RegistrarMedicionState,
  formData: FormData
): Promise<RegistrarMedicionState> {
  await requireAdmin();

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
  const { error } = await supabase
    .from("mediciones")
    .update({
      fecha,
      peso_kg: pesoKg,
      grasa_corporal_pct: grasaPct,
      medidas,
      notas: notas || null,
    })
    .eq("id", medicionId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/panel/socios/${socioId}`);
  return { success: true };
}

export async function eliminarMedicion(socioId: string, id: string) {
  await requireAdmin();

  const supabase = await createClient();
  await supabase.from("mediciones").delete().eq("id", id);
  revalidatePath(`/panel/socios/${socioId}`);
}

export interface InscribirSocioState {
  error?: string;
  success?: boolean;
}

/** Inscripción anticipada del socio a una clase fija — no confundir con el
 * registro de asistencia por sesión (registrarClaseTomada). Solo el admin. */
export async function inscribirSocio(
  socioId: string,
  _prevState: InscribirSocioState,
  formData: FormData
): Promise<InscribirSocioState> {
  await requireAdmin();

  const claseId = String(formData.get("clase_id") ?? "").trim();
  if (!claseId) {
    return { error: "Elegí una clase." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("inscripciones").insert({
    socio_id: socioId,
    clase_id: claseId,
    created_by: user?.id ?? null,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Ya está inscripto en esa clase." };
    }
    return { error: error.message };
  }

  revalidatePath(`/panel/socios/${socioId}`);
  return { success: true };
}

export async function desinscribirSocio(socioId: string, id: string) {
  await requireAdmin();

  const supabase = await createClient();
  await supabase.from("inscripciones").delete().eq("id", id);
  revalidatePath(`/panel/socios/${socioId}`);
}
