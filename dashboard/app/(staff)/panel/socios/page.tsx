import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { NuevoSocioForm } from "@/components/staff/NuevoSocioForm";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import type { Profile } from "@/lib/types";

export default async function SociosPage() {
  // La lista es de todo el staff; dar de alta cuentas, solo del admin.
  const { role } = await requireStaff();
  const supabase = await createClient();
  const { data: socios } = await supabase
    .from("profiles")
    .select("id, full_name, phone, activo, created_at")
    .eq("role", "socio")
    .order("created_at", { ascending: false })
    .returns<Pick<Profile, "id" | "full_name" | "phone" | "activo" | "created_at">[]>();

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
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {!socios || socios.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-muted">
                    Todavía no hay socios cargados.
                  </td>
                </tr>
              ) : (
                socios.map((socio) => (
                  <tr key={socio.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <Link href={`/panel/socios/${socio.id}`} className="text-text hover:underline">
                        {socio.full_name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted">{socio.phone || "—"}</td>
                    <td className="px-4 py-3">
                      {socio.activo ? (
                        <span className="text-success">Activo</span>
                      ) : (
                        <span className="text-muted">Inactivo</span>
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
