import Link from "next/link";
import { Container } from "@/components/panel/ui/Container";
import { LogoutButton } from "@/components/panel/ui/LogoutButton";
import { getSessionProfile, panelHome } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata = { robots: { index: false, follow: false } };

export default async function LoginPage() {
  const profile = await getSessionProfile();

  return (
    <main className="flex min-h-screen items-center">
      <Container className="max-w-sm">
        <Link href="/" className="text-sm text-muted transition-colors hover:text-accent-soft">
          ← Volver al sitio
        </Link>

        {profile ? (
          <>
            <h1 className="mt-4 font-display text-2xl font-bold text-text">
              Ya tenés la sesión abierta
            </h1>
            <p className="mt-1 text-sm text-muted">
              Ingresaste como <span className="text-text">{profile.full_name ?? "tu cuenta"}</span>.
            </p>

            <Link
              href={panelHome(profile.role)}
              className="mt-8 block rounded-pill bg-accent px-4 py-2.5 text-center font-semibold text-bg transition-opacity hover:opacity-90"
            >
              Ir a mi panel
            </Link>

            <div className="mt-6 flex items-center gap-1.5 text-sm text-muted">
              ¿No sos vos?
              <LogoutButton label="Entrar con otra cuenta" />
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-4 font-display text-2xl font-bold text-text">Ingresá a tu cuenta</h1>
            <p className="mt-1 text-sm text-muted">
              Despertarmente — socios y profesores entran por acá.
            </p>
            <LoginForm />
          </>
        )}
      </Container>
    </main>
  );
}
