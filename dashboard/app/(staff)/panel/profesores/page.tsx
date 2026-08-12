import { Container } from "@/components/ui/Container";
import { NuevoProfesorForm } from "@/components/staff/NuevoProfesorForm";
import { DarAccesoForm } from "@/components/staff/DarAccesoForm";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import type { Profesor } from "@/lib/types";
import { toggleProfesorActivo } from "./actions";

export default async function ProfesoresPage() {
  // Administración pura: el profesor no gestiona el plantel ni los accesos.
  await requireAdmin();

  const supabase = await createClient();
  const { data: profesores } = await supabase
    .from("profesores")
    .select("id, nombre_completo, especialidad, telefono, activo, profile_id, created_at")
    .order("created_at", { ascending: false })
    .returns<Profesor[]>();

  return (
    <main className="py-12">
      <Container className="max-w-4xl">
        <h1 className="font-display text-2xl font-bold text-text">Profesores</h1>
        <p className="mt-1 text-sm text-muted">
          Una ficha figura en la grilla de clases. El acceso al panel es aparte: con cuenta,
          el profesor carga asistencia, rutinas y mediciones de los socios.
        </p>

        <div className="mt-8">
          <NuevoProfesorForm />
        </div>

        <div className="mt-8 overflow-x-auto rounded-card border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Especialidad</th>
                <th className="px-4 py-3 font-medium">Teléfono</th>
                <th className="px-4 py-3 font-medium">Acceso al panel</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {!profesores || profesores.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-muted">
                    Todavía no hay profesores cargados.
                  </td>
                </tr>
              ) : (
                profesores.map((profesor) => (
                  <tr key={profesor.id} className="border-t border-border">
                    <td className="px-4 py-3 text-text">{profesor.nombre_completo}</td>
                    <td className="px-4 py-3 text-muted">{profesor.especialidad || "—"}</td>
                    <td className="px-4 py-3 text-muted">{profesor.telefono || "—"}</td>
                    <td className="px-4 py-3">
                      {profesor.profile_id ? (
                        <span className="text-success">Con cuenta</span>
                      ) : (
                        <DarAccesoForm
                          profesorId={profesor.id}
                          nombreProfesor={profesor.nombre_completo}
                        />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {profesor.activo ? (
                        <span className="text-success">Activo</span>
                      ) : (
                        <span className="text-muted">Inactivo</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <form
                        action={toggleProfesorActivo.bind(null, profesor.id, !profesor.activo)}
                      >
                        <button
                          type="submit"
                          className="text-sm text-accent-soft underline-offset-2 hover:underline"
                        >
                          {profesor.activo ? "Desactivar" : "Reactivar"}
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
