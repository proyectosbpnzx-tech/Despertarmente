import { Container } from "@/components/panel/ui/Container";
import { createClient } from "@/lib/supabase/server";
import type { Rutina } from "@/lib/types";

export default async function MisRutinasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: rutinas } = await supabase
    .from("rutinas")
    .select(
      "id, socio_id, nombre, descripcion, ejercicios, asignada_por, fecha_inicio, activa, created_at, updated_at"
    )
    .eq("socio_id", user!.id)
    .order("fecha_inicio", { ascending: false })
    .returns<Rutina[]>();

  return (
    <main className="py-12">
      <Container>
        <h1 className="font-display text-2xl font-bold text-text">Mis rutinas</h1>
        <p className="mt-1 text-sm text-muted">Lo que tu profe te fue asignando.</p>

        <div className="mt-8 flex flex-col gap-4">
          {!rutinas || rutinas.length === 0 ? (
            <p className="rounded-card border border-dashed border-accent/60 bg-accent/5 p-6 text-center text-muted">
              Todavía no tenés rutinas asignadas.
            </p>
          ) : (
            rutinas.map((rutina) => (
              <div key={rutina.id} className="rounded-card border border-border bg-surface p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="font-display text-lg font-bold text-text">{rutina.nombre}</h2>
                    <p className="text-sm text-muted">
                      Desde {rutina.fecha_inicio}
                      {rutina.descripcion ? ` · ${rutina.descripcion}` : ""}
                    </p>
                  </div>
                  {rutina.activa ? (
                    <span className="text-sm text-success">Activa</span>
                  ) : (
                    <span className="text-sm text-muted">Inactiva</span>
                  )}
                </div>

                <ul className="mt-4 flex flex-col gap-2 text-sm">
                  {rutina.ejercicios.map((ejercicio, index) => (
                    <li key={index} className="rounded-[0.5rem] border border-border p-2.5 text-muted">
                      <span className="font-semibold text-text">{ejercicio.nombre}</span>
                      {ejercicio.series && ` · ${ejercicio.series} series`}
                      {ejercicio.reps && ` · ${ejercicio.reps} reps`}
                      {ejercicio.descanso && ` · descanso ${ejercicio.descanso}`}
                      {ejercicio.notas && ` · ${ejercicio.notas}`}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </Container>
    </main>
  );
}
