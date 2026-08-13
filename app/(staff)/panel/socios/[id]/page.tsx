import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/panel/ui/Container";
import { RegistrarClaseTomadaForm } from "@/components/panel/staff/RegistrarClaseTomadaForm";
import { AsignarRutinaForm } from "@/components/panel/staff/AsignarRutinaForm";
import { RegistrarMedicionForm } from "@/components/panel/staff/RegistrarMedicionForm";
import { InscribirClaseForm } from "@/components/panel/staff/InscribirClaseForm";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import type { Clase, ClaseTomada, Inscripcion, Medicion, Profile, Rutina } from "@/lib/types";
import {
  eliminarClaseTomada,
  toggleRutinaActiva,
  eliminarMedicion,
  desinscribirSocio,
} from "./actions";

type ClaseTomadaConClase = ClaseTomada & { clases: { nombre: string } | null };
type InscripcionConClase = Inscripcion & {
  clases: { nombre: string; dia_semana: string | null; horario: string | null } | null;
};

const DIA_LABELS: Record<string, string> = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo",
};

export default async function SocioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Ficha completa del socio: la ve todo el staff. Cargarla (asistencia,
  // rutinas, mediciones) es del profesor; inscribir y supervisar mediciones
  // es del admin — ver README.
  const { role } = await requireStaff();
  const esAdmin = role === "admin";
  const esProfesor = role === "profesor";

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

  const [
    { data: clasesActivas },
    { data: clasesTomadas },
    { data: rutinas },
    { data: mediciones },
    { data: inscripciones },
  ] = await Promise.all([
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
    supabase
      .from("inscripciones")
      .select("id, socio_id, clase_id, created_by, created_at, clases(nombre, dia_semana, horario)")
      .eq("socio_id", id)
      .order("created_at", { ascending: false })
      .returns<InscripcionConClase[]>(),
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

        {esAdmin && (
          <div className="mt-8">
            <InscribirClaseForm socioId={socio.id} clases={clasesActivas ?? []} />
          </div>
        )}

        <h2 className="mt-10 font-display text-lg font-bold text-text">Inscripciones</h2>
        <div className="mt-4 overflow-x-auto rounded-card border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Clase</th>
                <th className="px-4 py-3 font-medium">Día / horario</th>
                {esAdmin && <th className="px-4 py-3 font-medium"></th>}
              </tr>
            </thead>
            <tbody>
              {!inscripciones || inscripciones.length === 0 ? (
                <tr>
                  <td colSpan={esAdmin ? 3 : 2} className="px-4 py-6 text-center text-muted">
                    Todavía no está inscripto en ninguna clase.
                  </td>
                </tr>
              ) : (
                inscripciones.map((inscripcion) => (
                  <tr key={inscripcion.id} className="border-t border-border">
                    <td className="px-4 py-3 text-text">{inscripcion.clases?.nombre || "—"}</td>
                    <td className="px-4 py-3 text-muted">
                      {inscripcion.clases?.dia_semana
                        ? DIA_LABELS[inscripcion.clases.dia_semana]
                        : "—"}
                      {inscripcion.clases?.horario ? ` · ${inscripcion.clases.horario}` : ""}
                    </td>
                    {esAdmin && (
                      <td className="px-4 py-3 text-right">
                        <form action={desinscribirSocio.bind(null, socio.id, inscripcion.id)}>
                          <button
                            type="submit"
                            className="text-sm text-danger underline-offset-2 hover:underline"
                          >
                            Quitar
                          </button>
                        </form>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {esProfesor && (
          <div className="mt-10">
            <RegistrarClaseTomadaForm socioId={socio.id} clases={clasesActivas ?? []} />
          </div>
        )}

        <h2 className="mt-10 font-display text-lg font-bold text-text">Clases tomadas</h2>
        <div className="mt-4 overflow-x-auto rounded-card border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Clase</th>
                <th className="px-4 py-3 font-medium">Presente</th>
                <th className="px-4 py-3 font-medium">Notas</th>
                {esProfesor && <th className="px-4 py-3 font-medium"></th>}
              </tr>
            </thead>
            <tbody>
              {!clasesTomadas || clasesTomadas.length === 0 ? (
                <tr>
                  <td colSpan={esProfesor ? 5 : 4} className="px-4 py-6 text-center text-muted">
                    Todavía no se registraron clases para este socio.
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
                    {esProfesor && (
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
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {esProfesor && (
          <div className="mt-10">
            <AsignarRutinaForm socioId={socio.id} />
          </div>
        )}

        <h2 className="mt-10 font-display text-lg font-bold text-text">Rutinas</h2>
        <div className="mt-4 flex flex-col gap-4">
          {!rutinas || rutinas.length === 0 ? (
            <p className="rounded-card border border-border bg-surface p-6 text-center text-muted">
              Todavía no tiene rutinas asignadas.
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
                    {esProfesor && (
                      <form action={toggleRutinaActiva.bind(null, socio.id, rutina.id, !rutina.activa)}>
                        <button
                          type="submit"
                          className="text-sm text-accent-soft underline-offset-2 hover:underline"
                        >
                          {rutina.activa ? "Desactivar" : "Reactivar"}
                        </button>
                      </form>
                    )}
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

        {esProfesor && (
          <div className="mt-10">
            <RegistrarMedicionForm socioId={socio.id} />
          </div>
        )}

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
                {esAdmin && <th className="px-4 py-3 font-medium"></th>}
              </tr>
            </thead>
            <tbody>
              {!mediciones || mediciones.length === 0 ? (
                <tr>
                  <td colSpan={esAdmin ? 6 : 5} className="px-4 py-6 text-center text-muted">
                    Todavía no se registraron mediciones para este socio.
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
                    {esAdmin && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-3">
                          <Link
                            href={`/panel/socios/${socio.id}/mediciones/${medicion.id}`}
                            className="text-sm text-accent-soft underline-offset-2 hover:underline"
                          >
                            Editar
                          </Link>
                          <form action={eliminarMedicion.bind(null, socio.id, medicion.id)}>
                            <button
                              type="submit"
                              className="text-sm text-danger underline-offset-2 hover:underline"
                            >
                              Eliminar
                            </button>
                          </form>
                        </div>
                      </td>
                    )}
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
