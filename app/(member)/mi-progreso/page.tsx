import Link from "next/link";
import { Container } from "@/components/panel/ui/Container";
import { requireSocio } from "@/lib/auth";
import { contarProgreso } from "@/lib/progreso";
import { createClient } from "@/lib/supabase/server";
import type { Medicion } from "@/lib/types";

export default async function MiProgresoPage() {
  const { id, full_name } = await requireSocio();

  // contarProgreso ya corrió en el layout: cache() lo devuelve sin repetir.
  const contadores = await contarProgreso(id);

  const supabase = await createClient();
  const [{ count: rutinasActivas }, { data: ultimaMedicion }] = await Promise.all([
    supabase
      .from("rutinas")
      .select("id", { count: "exact", head: true })
      .eq("socio_id", id)
      .eq("activa", true),
    supabase
      .from("mediciones")
      .select("fecha, peso_kg")
      .eq("socio_id", id)
      .order("fecha", { ascending: false })
      .limit(1)
      .maybeSingle<Pick<Medicion, "fecha" | "peso_kg">>(),
  ]);

  const activas = rutinasActivas ?? 0;
  const sinNada =
    contadores.clases === 0 && contadores.rutinas === 0 && contadores.mediciones === 0;

  const tarjetas = [
    {
      href: "/mi-progreso/clases",
      n: contadores.clases,
      label: contadores.clases === 1 ? "clase tomada" : "clases tomadas",
    },
    {
      href: "/mi-progreso/rutinas",
      n: activas,
      label: activas === 1 ? "rutina activa" : "rutinas activas",
    },
    {
      href: "/mi-progreso/mediciones",
      n: contadores.mediciones,
      label: contadores.mediciones === 1 ? "medición" : "mediciones",
    },
  ];

  return (
    <main className="py-12">
      <Container>
        <h1 className="font-display text-2xl font-bold text-text">
          Hola{full_name ? `, ${full_name}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted">Este es tu panel de progreso.</p>

        {sinNada ? (
          <div className="mt-8 rounded-card border border-dashed border-accent/60 bg-accent/5 p-6 text-center text-muted">
            Todavía no tenés rutinas, clases o mediciones cargadas. Tu profe las va a ir sumando
            acá.
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {tarjetas.map((tarjeta) => (
                <Link
                  key={tarjeta.href}
                  href={tarjeta.href}
                  className="rounded-card border border-border bg-surface px-5 py-4 hover:border-accent"
                >
                  <span className="block font-display text-3xl font-bold tabular-nums text-text">
                    {tarjeta.n}
                  </span>
                  <span className="mt-1 block text-sm text-muted">{tarjeta.label}</span>
                </Link>
              ))}
            </div>

            {ultimaMedicion && (
              <p className="mt-6 text-sm text-muted">
                Última medición: {ultimaMedicion.fecha}
                {ultimaMedicion.peso_kg !== null ? ` · ${ultimaMedicion.peso_kg} kg` : ""}
              </p>
            )}
          </>
        )}
      </Container>
    </main>
  );
}
