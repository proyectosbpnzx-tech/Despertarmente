import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/panel/ui/Container";
import { EditarMedicionForm } from "@/components/panel/staff/EditarMedicionForm";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import type { Medicion } from "@/lib/types";

export default async function EditarMedicionPage({
  params,
}: {
  params: Promise<{ id: string; medicionId: string }>;
}) {
  // Corregir una medición es supervisión: solo el admin. El profesor la
  // carga (registrarMedicion) pero no la puede tocar después.
  await requireAdmin();

  const { id, medicionId } = await params;
  const supabase = await createClient();

  const { data: medicion } = await supabase
    .from("mediciones")
    .select("id, socio_id, fecha, peso_kg, grasa_corporal_pct, medidas, notas, registrado_por, created_at")
    .eq("id", medicionId)
    .eq("socio_id", id)
    .single<Medicion>();

  if (!medicion) {
    notFound();
  }

  return (
    <main className="py-12">
      <Container className="max-w-2xl">
        <Link href={`/panel/socios/${id}`} className="text-sm text-accent-soft hover:underline">
          ← Volver a la ficha
        </Link>

        <h1 className="mt-3 font-display text-2xl font-bold text-text">Editar medición</h1>

        <div className="mt-8">
          <EditarMedicionForm socioId={id} medicion={medicion} />
        </div>
      </Container>
    </main>
  );
}
