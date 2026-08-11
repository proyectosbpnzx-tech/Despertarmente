import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LogoutButton } from "@/components/ui/LogoutButton";
import { LANDING_URL } from "@/lib/site";

const LINKS = [
  { href: "/mi-progreso", label: "Inicio" },
  { href: "/mi-progreso/clases", label: "Clases" },
  { href: "/mi-progreso/rutinas", label: "Rutinas" },
  { href: "/mi-progreso/mediciones", label: "Mediciones" },
];

export function MemberNav() {
  return (
    <nav className="border-b border-border bg-surface">
      <Container className="flex items-center justify-between">
        <ul className="flex gap-6 overflow-x-auto py-3 text-sm">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-muted hover:text-text">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex shrink-0 items-center gap-4">
          <a href={LANDING_URL} className="text-sm text-muted hover:text-accent-soft">
            Volver al sitio
          </a>
          <LogoutButton />
        </div>
      </Container>
    </nav>
  );
}
