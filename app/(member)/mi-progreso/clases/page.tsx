import { Container } from "@/components/panel/ui/Container";
import { createClient } from "@/lib/supabase/server";

interface ClaseTomadaConDetalle {
  id: string;
  fecha: string;
  presente: boolean;
  notas: string | null;
  clases: { nombre: string; profesores: { nombre_completo: string } | null } | null;
}

export default async function MisClasesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: clasesTomadas } = await supabase
    .from("clases_tomadas")
    .select("id, fecha, presente, notas, clases(nombre, profesores(nombre_completo))")
    .eq("socio_id", user!.id)
    .order("fecha", { ascending: false })
    .returns<ClaseTomadaConDetalle[]>();

  return (
    <main className="py-12">
      <Container>
        <h1 className="font-display text-2xl font-bold text-text">Mis clases</h1>
        <p className="mt-1 text-sm text-muted">Historial de clases tomadas.</p>

        <div className="mt-8 overflow-x-auto rounded-card border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Clase</th>
                <th className="px-4 py-3 font-medium">Profesor</th>
                <th className="px-4 py-3 font-medium">Presente</th>
              </tr>
            </thead>
            <tbody>
              {!clasesTomadas || clasesTomadas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-muted">
                    Todavía no tenés clases registradas.
                  </td>
                </tr>
              ) : (
                clasesTomadas.map((registro) => (
                  <tr key={registro.id} className="border-t border-border">
                    <td className="px-4 py-3 text-text">{registro.fecha}</td>
                    <td className="px-4 py-3 text-text">{registro.clases?.nombre || "—"}</td>
                    <td className="px-4 py-3 text-muted">
                      {registro.clases?.profesores?.nombre_completo || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {registro.presente ? (
                        <span className="text-success">Sí</span>
                      ) : (
                        <span className="text-muted">No</span>
                      )}
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
