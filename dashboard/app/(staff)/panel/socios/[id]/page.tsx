import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { RegistrarClaseTomadaForm } from "@/components/staff/RegistrarClaseTomadaForm";
import { AsignarRutinaForm } from "@/components/staff/AsignarRutinaForm";
import { RegistrarMedicionForm } from "@/components/staff/RegistrarMedicionForm";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import type { Clase, ClaseTomada, Medicion, Profile, Rutina } from "@/lib/types";
import { eliminarClaseTomada, toggleRutinaActiva, eliminarMedicion } from "./actions";

type ClaseTomadaConClase = ClaseTomada & { clases: { nombre: string } | null };

export default async function SocioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Ficha completa del socio: la ve y la carga todo el staff.
  await requireStaff();

  const { id } = await params;
  const supabase = await createClient();

  const { data: socio } = await supabase
    .from("profiles")
    .select("id, full_name, phone, activo, created_at")
    .eq("id", id)
    .eq("role", "socio")
    .single<Pick<Profile, "id" | "full_name" | "phone" | "activo" | "created_at">>();

  if (!socio) {
    notFound();
  }

  const [{ data: clasesActivas }, { data: clasesTomadas }, { data: rutinas }, { data: mediciones }] =
    await Promise.all([
      supabase
        .from("clases")
        .select("id, nombre, profesor_id, dia_semana, horario, cupo, activa, created_at")
        .eq("activa", true)
        .order("nombre")
        .returns<Clase[]>(),
      supabase
        .from("clases_tomadas")
        .select("id, socio_id, clase_id, fecha, presente, notas, registrado_por, created_at, clases(nombre)")
        .eq("socio_id", id)
        .order("fecha", { ascending: false })
        .returns<ClaseTomadaConClase[]>(),
      supabase
        .from("rutinas")
        .select(
          "id, socio_id, nombre, descripcion, ejercicios, asignada_por, fecha_inicio, activa, created_at, updated_at"
        )
        .eq("socio_id", id)
        .order("fecha_inicio", { ascending: false })
        .returns<Rutina[]>(),
      supabase
        .from("mediciones")
        .select("id, socio_id, fecha, peso_kg, grasa_corporal_pct, medidas, notas, registrado_por, created_at")
        .eq("socio_id", id)
        .order("fecha", { ascending: false })
        .returns<Medicion[]>(),
    ]);

  return (
    <main className="py-12">
      <Container className="max-w-4xl">
        <Link href="/panel/socios" className="text-sm text-accent-soft hover:underline">
          ← Socios
        </Link>

        <h1 className="mt-3 font-display text-2xl font-bold text-text">
          {socio.full_name || "Sin nombre"}
        </h1>
        <p className="mt-1 text-sm text-muted">{socio.phone || "Sin teléfono"}</p>

        <div className="mt-8">
          <RegistrarClaseTomadaForm socioId={socio.id} clases={clasesActivas ?? []} />
        </div>

        <h2 className="mt-10 font-display text-lg font-bold text-text">Clases tomadas</h2>
        <div className="mt-4 overflow-x-auto rounded-card border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Clase</th>
                <th className="px-4 py-3 font-medium">Presente</th>
                <th className="px-4 py-3 font-medium">Notas</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {!clasesTomadas || clasesTomadas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-muted">
                    Todavía no registraste clases para este socio.
                  </td>
                </tr>
              ) : (
                clasesTomadas.map((registro) => (
                  <tr key={registro.id} className="border-t border-border">
                    <td className="px-4 py-3 text-text">{registro.fecha}</td>
                    <td className="px-4 py-3 text-text">{registro.clases?.nombre || "—"}</td>
                    <td className="px-4 py-3">
                      {registro.presente ? (
                        <span className="text-success">Sí</span>
                      ) : (
                        <span className="text-muted">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted">{registro.notas || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <form action={eliminarClaseTomada.bind(null, socio.id, registro.id)}>
                        <button
                          type="submit"
                          className="text-sm text-danger underline-offset-2 hover:underline"
                        >
                          Eliminar
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-10">
          <AsignarRutinaForm socioId={socio.id} />
        </div>

        <h2 className="mt-10 font-display text-lg font-bold text-text">Rutinas</h2>
        <div className="mt-4 flex flex-col gap-4">
          {!rutinas || rutinas.length === 0 ? (
            <p className="rounded-card border border-border bg-surface p-6 text-center text-muted">
              Todavía no le asignaste rutinas a este socio.
            </p>
          ) : (
            rutinas.map((rutina) => (
              <div key={rutina.id} className="rounded-card border border-border bg-surface p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-display text-base font-bold text-text">{rutina.nombre}</h3>
                    <p className="text-sm text-muted">
                      Desde {rutina.fecha_inicio}
                      {rutina.descripcion ? ` · ${rutina.descripcion}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {rutina.activa ? (
                      <span className="text-sm text-success">Activa</span>
                    ) : (
                      <span className="text-sm text-muted">Inactiva</span>
                    )}
                    <form action={toggleRutinaActiva.bind(null, socio.id, rutina.id, !rutina.activa)}>
                      <button
                        type="submit"
                        className="text-sm text-accent-soft underline-offset-2 hover:underline"
                      >
                        {rutina.activa ? "Desactivar" : "Reactivar"}
                      </button>
                    </form>
                  </div>
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

        <div className="mt-10">
          <RegistrarMedicionForm socioId={socio.id} />
        </div>

        <h2 className="mt-10 font-display text-lg font-bold text-text">Mediciones</h2>
        <div className="mt-4 overflow-x-auto rounded-card border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Peso</th>
                <th className="px-4 py-3 font-medium">Grasa</th>
                <th className="px-4 py-3 font-medium">Otras medidas</th>
                <th className="px-4 py-3 font-medium">Notas</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {!mediciones || mediciones.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-muted">
                    Todavía no registraste mediciones para este socio.
                  </td>
                </tr>
              ) : (
                mediciones.map((medicion) => (
                  <tr key={medicion.id} className="border-t border-border">
                    <td className="px-4 py-3 text-text">{medicion.fecha}</td>
                    <td className="px-4 py-3 text-muted">
                      {medicion.peso_kg !== null ? `${medicion.peso_kg} kg` : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {medicion.grasa_corporal_pct !== null ? `${medicion.grasa_corporal_pct}%` : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {medicion.medidas.length === 0
                        ? "—"
                        : medicion.medidas.map((m) => `${m.nombre}: ${m.valor}`).join(" · ")}
                    </td>
                    <td className="px-4 py-3 text-muted">{medicion.notas || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <form action={eliminarMedicion.bind(null, socio.id, medicion.id)}>
                        <button
                          type="submit"
                          className="text-sm text-danger underline-offset-2 hover:underline"
                        >
                          Eliminar
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Container>
    </main>
  );
}
