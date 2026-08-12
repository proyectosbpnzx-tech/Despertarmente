import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { requireStaff } from "@/lib/auth";

const ACCESOS: { href: string; label: string; detalle: string; adminOnly?: boolean }[] = [
  {
    href: "/panel/socios",
    label: "Socios",
    detalle: "Asistencia, rutinas y mediciones",
  },
  {
    href: "/panel/clases",
    label: "Clases",
    detalle: "Grilla semanal del centro",
  },
  {
    href: "/panel/profesores",
    label: "Profesores",
    detalle: "Fichas y acceso al panel",
    adminOnly: true,
  },
];

export default async function PanelHomePage() {
  const { role, full_name } = await requireStaff();
  const esAdmin = role === "admin";
  const accesos = ACCESOS.filter((acceso) => !acceso.adminOnly || esAdmin);

  return (
    <main className="py-12">
      <Container className="max-w-4xl">
        <h1 className="font-display text-2xl font-bold text-text">
          {esAdmin ? "Panel de administración" : "Panel de profesores"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {full_name ? `Hola, ${full_name}.` : "Despertarmente."}{" "}
          {esAdmin
            ? "Administrás cuentas, catálogo y seguimiento."
            : "Cargás el seguimiento de los socios."}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {accesos.map((acceso) => (
            <Link
              key={acceso.href}
              href={acceso.href}
              className="rounded-card border border-border bg-surface px-5 py-4 hover:border-accent"
            >
              <span className="font-semibold text-text">{acceso.label} →</span>
              <span className="mt-1 block text-sm text-muted">{acceso.detalle}</span>
            </Link>
          ))}
        </div>
      </Container>
    </main>
  );
}
