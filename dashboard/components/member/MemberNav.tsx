import Link from "next/link";
import { Container } from "@/components/ui/Container";

const LINKS = [
  { href: "/mi-progreso", label: "Inicio" },
  { href: "/mi-progreso/clases", label: "Clases" },
  { href: "/mi-progreso/rutinas", label: "Rutinas" },
  { href: "/mi-progreso/mediciones", label: "Mediciones" },
];

export function MemberNav() {
  return (
    <nav className="border-b border-border bg-surface">
      <Container>
        <ul className="flex gap-6 overflow-x-auto py-3 text-sm">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-muted hover:text-text">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  );
}
