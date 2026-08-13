import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * Cuántos registros tiene un socio de cada cosa. Alimenta los badges del nav
 * (MemberNav) y las tarjetas de resumen de /mi-progreso.
 *
 * Va envuelto en cache() de React porque el layout y la página se renderizan
 * en el mismo request: sin esto, entrar a /mi-progreso dispararía las mismas
 * tres consultas dos veces.
 *
 * Usa count exacto con head: true — pide el número, no las filas. RLS ya
 * limita al socio a lo suyo, pero filtramos por socio_id igual: el helper lo
 * usa el panel de socio, donde el id siempre es el de la sesión.
 */
export interface ContadoresSocio {
  clases: number;
  rutinas: number;
  mediciones: number;
}

export const contarProgreso = cache(async (socioId: string): Promise<ContadoresSocio> => {
  const supabase = await createClient();

  const [clases, rutinas, mediciones] = await Promise.all([
    supabase
      .from("clases_tomadas")
      .select("id", { count: "exact", head: true })
      .eq("socio_id", socioId),
    supabase.from("rutinas").select("id", { count: "exact", head: true }).eq("socio_id", socioId),
    supabase
      .from("mediciones")
      .select("id", { count: "exact", head: true })
      .eq("socio_id", socioId),
  ]);

  return {
    clases: clases.count ?? 0,
    rutinas: rutinas.count ?? 0,
    mediciones: mediciones.count ?? 0,
  };
});
