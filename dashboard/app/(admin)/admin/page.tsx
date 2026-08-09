import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function AdminHomePage() {
  return (
    <main className="py-12">
      <Container>
        <h1 className="font-display text-2xl font-bold text-text">Panel de administración</h1>
        <p className="mt-1 text-sm text-muted">Despertarmente</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Link
            href="/admin/socios"
            className="inline-flex items-center gap-2 rounded-card border border-border bg-surface px-5 py-4 font-semibold text-text hover:border-accent"
          >
            Socios →
          </Link>
          <Link
            href="/admin/profesores"
            className="inline-flex items-center gap-2 rounded-card border border-border bg-surface px-5 py-4 font-semibold text-text hover:border-accent"
          >
            Profesores →
          </Link>
          <Link
            href="/admin/clases"
            className="inline-flex items-center gap-2 rounded-card border border-border bg-surface px-5 py-4 font-semibold text-text hover:border-accent"
          >
            Clases →
          </Link>
        </div>
      </Container>
    </main>
  );
}
