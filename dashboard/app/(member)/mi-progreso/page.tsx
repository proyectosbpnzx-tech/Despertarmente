import { Container } from "@/components/ui/Container";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export default async function MiProgresoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single<Pick<Profile, "full_name">>();

  return (
    <main className="py-12">
      <Container>
        <h1 className="font-display text-2xl font-bold text-text">
          Hola{profile?.full_name ? `, ${profile.full_name}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted">Este es tu panel de progreso.</p>

        <div className="mt-8 rounded-card border border-dashed border-accent/60 bg-accent/5 p-6 text-center text-muted">
          Todavía no tenés rutinas, clases o mediciones cargadas. Tu profe las va a ir sumando
          acá.
        </div>
      </Container>
    </main>
  );
}
