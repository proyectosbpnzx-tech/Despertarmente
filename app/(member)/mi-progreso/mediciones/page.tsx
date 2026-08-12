import { Container } from "@/components/panel/ui/Container";
import { createClient } from "@/lib/supabase/server";
import type { Medicion } from "@/lib/types";

export default async function MisMedicionesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: mediciones } = await supabase
    .from("mediciones")
    .select("id, socio_id, fecha, peso_kg, grasa_corporal_pct, medidas, notas, registrado_por, created_at")
    .eq("socio_id", user!.id)
    .order("fecha", { ascending: false })
    .returns<Medicion[]>();

  return (
    <main className="py-12">
      <Container>
        <h1 className="font-display text-2xl font-bold text-text">Mis mediciones</h1>
        <p className="mt-1 text-sm text-muted">Historial de peso, grasa corporal y otras medidas.</p>

        <div className="mt-8 overflow-x-auto rounded-card border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Peso</th>
                <th className="px-4 py-3 font-medium">Grasa</th>
                <th className="px-4 py-3 font-medium">Otras medidas</th>
              </tr>
            </thead>
            <tbody>
              {!mediciones || mediciones.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-muted">
                    Todavía no tenés mediciones registradas.
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
