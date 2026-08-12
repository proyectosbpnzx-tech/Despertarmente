import { Container } from "@/components/ui/Container";
import { NuevaClaseForm } from "@/components/staff/NuevaClaseForm";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import type { Clase, Profesor } from "@/lib/types";
import { toggleClaseActiva } from "./actions";

const DIA_LABELS: Record<string, string> = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo",
};

type ClaseConProfesor = Clase & { profesores: { nombre_completo: string } | null };

export default async function ClasesPage() {
  // La grilla la consulta todo el staff (el profesor necesita verla); crear y
  // desactivar clases es del admin.
  const { role } = await requireStaff();
  const esAdmin = role === "admin";
  const supabase = await createClient();

  const [{ data: clases }, { data: profesoresActivos }] = await Promise.all([
    supabase
      .from("clases")
      .select("id, nombre, dia_semana, horario, cupo, activa, created_at, profesores(nombre_completo)")
      .order("created_at", { ascending: false })
      .returns<ClaseConProfesor[]>(),
    supabase
      .from("profesores")
      .select("id, nombre_completo, especialidad, telefono, activo, created_at")
      .eq("activo", true)
      .order("nombre_completo")
      .returns<Profesor[]>(),
  ]);

  return (
    <main className="py-12">
      <Container className="max-w-4xl">
        <h1 className="font-display text-2xl font-bold text-text">Clases</h1>

        {esAdmin && (
          <div className="mt-8">
            <NuevaClaseForm profesores={profesoresActivos ?? []} />
          </div>
        )}

        <div className="mt-8 overflow-x-auto rounded-card border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Profesor</th>
                <th className="px-4 py-3 font-medium">Día / horario</th>
                <th className="px-4 py-3 font-medium">Cupo</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                {esAdmin && <th className="px-4 py-3 font-medium"></th>}
              </tr>
            </thead>
            <tbody>
              {!clases || clases.length === 0 ? (
                <tr>
                  <td colSpan={esAdmin ? 6 : 5} className="px-4 py-6 text-center text-muted">
                    Todavía no hay clases cargadas.
                  </td>
                </tr>
              ) : (
                clases.map((clase) => (
                  <tr key={clase.id} className="border-t border-border">
                    <td className="px-4 py-3 text-text">{clase.nombre}</td>
                    <td className="px-4 py-3 text-muted">
                      {clase.profesores?.nombre_completo || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {clase.dia_semana ? DIA_LABELS[clase.dia_semana] : "—"}
                      {clase.horario ? ` · ${clase.horario}` : ""}
                    </td>
                    <td className="px-4 py-3 text-muted">{clase.cupo ?? "—"}</td>
                    <td className="px-4 py-3">
                      {clase.activa ? (
                        <span className="text-success">Activa</span>
                      ) : (
                        <span className="text-muted">Inactiva</span>
                      )}
                    </td>
                    {esAdmin && (
                      <td className="px-4 py-3 text-right">
                        <form action={toggleClaseActiva.bind(null, clase.id, !clase.activa)}>
                          <button
                            type="submit"
                            className="text-sm text-accent-soft underline-offset-2 hover:underline"
                          >
                            {clase.activa ? "Desactivar" : "Reactivar"}
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
      </Container>
    </main>
  );
}
