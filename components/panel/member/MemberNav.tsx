import Link from "next/link";
import { Container } from "@/components/panel/ui/Container";
import { Contador } from "@/components/panel/ui/Contador";
import { LogoutButton } from "@/components/panel/ui/LogoutButton";
import type { ContadoresSocio } from "@/lib/progreso";

const LINKS: { href: string; label: string; contador?: keyof ContadoresSocio }[] = [
  { href: "/mi-progreso", label: "Inicio" },
  { href: "/mi-progreso/clases", label: "Clases", contador: "clases" },
  { href: "/mi-progreso/rutinas", label: "Rutinas", contador: "rutinas" },
  { href: "/mi-progreso/mediciones", label: "Mediciones", contador: "mediciones" },
];

export function MemberNav({ contadores }: { contadores: ContadoresSocio }) {
  return (
    <nav className="border-b border-border bg-surface">
      <Container className="flex items-center justify-between">
        <ul className="flex gap-6 overflow-x-auto py-3 text-sm">
          {LINKS.map((link) => (
            <li key={link.href} className="shrink-0">
              <Link href={link.href} className="text-muted hover:text-text">
                {link.label}
                {link.contador && <Contador n={contadores[link.contador]} />}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex shrink-0 items-center gap-4">
          <Link href="/" className="text-sm text-muted hover:text-accent-soft">
            Volver al sitio
          </Link>
          <LogoutButton />
        </div>
      </Container>
    </nav>
  );
}
