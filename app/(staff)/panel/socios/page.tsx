import Link from "next/link";
import { Container } from "@/components/panel/ui/Container";
import { NuevoSocioForm } from "@/components/panel/staff/NuevoSocioForm";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import type { Profile } from "@/lib/types";

/**
 * Cuenta filas por socio_id.
 *
 * Se agrega en memoria en vez de con GROUP BY porque PostgREST no expone
 * agregaciones sin crear una vista o un RPC, y son 3 consultas fijas sin
 * importar cuántos socios haya. Para el tamaño del centro alcanza; si algún
 * día el historial crece mucho, el reemplazo natural es una vista con
 * GROUP BY y una migración.
 */
function contarPorSocio(filas: { socio_id: string }[] | null): Map<string, number> {
  const cuentas = new Map<string, number>();
  for (const fila of filas ?? []) {
    cuentas.set(fila.socio_id, (cuentas.get(fila.socio_id) ?? 0) + 1);
  }
  return cuentas;
}

export default async function SociosPage() {
  // La lista es de todo el staff; dar de alta cuentas, solo del admin.
  const { role } = await requireStaff();
  const supabase = await createClient();

  const [{ data: socios }, { data: clasesTomadas }, { data: rutinas }, { data: mediciones }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, phone, activo, created_at")
        .eq("role", "socio")
        .order("created_at", { ascending: false })
        .returns<Pick<Profile, "id" | "full_name" | "phone" | "activo" | "created_at">[]>(),
      supabase.from("clases_tomadas").select("socio_id").returns<{ socio_id: string }[]>(),
      supabase.from("rutinas").select("socio_id").returns<{ socio_id: string }[]>(),
      supabase.from("mediciones").select("socio_id").returns<{ socio_id: string }[]>(),
    ]);

  const porClases = contarPorSocio(clasesTomadas);
  const porRutinas = contarPorSocio(rutinas);
  const porMediciones = contarPorSocio(mediciones);

  const numeroClass = (n: number) => `px-4 py-3 tabular-nums ${n === 0 ? "text-muted/60" : "text-text"}`;

  return (
    <main className="py-12">
      <Container className="max-w-4xl">
        <h1 className="font-display text-2xl font-bold text-text">Socios</h1>

        {role === "admin" && (
          <div className="mt-8">
            <NuevoSocioForm />
          </div>
        )}

        <div className="mt-8 overflow-x-auto rounded-card border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Teléfono</th>
                <th className="px-4 py-3 font-medium">Clases</th>
                <th className="px-4 py-3 font-medium">Rutinas</th>
                <th className="px-4 py-3 font-medium">Mediciones</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {!socios || socios.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-muted">
                    Todavía no hay socios cargados.
                  </td>
                </tr>
              ) : (
                socios.map((socio) => {
                  const nClases = porClases.get(socio.id) ?? 0;
                  const nRutinas = porRutinas.get(socio.id) ?? 0;
                  const nMediciones = porMediciones.get(socio.id) ?? 0;

                  return (
                    <tr key={socio.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        <Link href={`/panel/socios/${socio.id}`} className="text-text hover:underline">
                          {socio.full_name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted">{socio.phone || "—"}</td>
                      <td className={numeroClass(nClases)}>{nClases}</td>
                      <td className={numeroClass(nRutinas)}>{nRutinas}</td>
                      <td className={numeroClass(nMediciones)}>{nMediciones}</td>
                      <td className="px-4 py-3">
                        {socio.activo ? (
                          <span className="text-success">Activo</span>
                        ) : (
                          <span className="text-muted">Inactivo</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Container>
    </main>
  );
}
