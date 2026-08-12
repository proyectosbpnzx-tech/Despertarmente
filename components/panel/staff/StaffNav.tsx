import Link from "next/link";
import { Container } from "@/components/panel/ui/Container";
import { LogoutButton } from "@/components/panel/ui/LogoutButton";
import type { Role } from "@/lib/types";

/** `adminOnly` deja fuera lo que es administración pura, no trabajo diario. */
const LINKS: { href: string; label: string; adminOnly?: boolean }[] = [
  { href: "/panel", label: "Inicio" },
  { href: "/panel/socios", label: "Socios" },
  { href: "/panel/clases", label: "Clases" },
  { href: "/panel/profesores", label: "Profesores", adminOnly: true },
];

const ROLE_LABEL: Record<Role, string> = {
  admin: "Administración",
  profesor: "Profesor",
  socio: "Socio",
};

export function StaffNav({ role }: { role: Role }) {
  const links = LINKS.filter((link) => !link.adminOnly || role === "admin");

  return (
    <nav className="border-b border-border bg-surface">
      <Container className="flex max-w-4xl items-center justify-between">
        <ul className="flex gap-6 overflow-x-auto py-3 text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-muted hover:text-text">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex shrink-0 items-center gap-4">
          <span className="hidden text-xs text-muted sm:inline">{ROLE_LABEL[role]}</span>
          <Link href="/" className="text-sm text-muted hover:text-accent-soft">
            Volver al sitio
          </Link>
          <LogoutButton />
        </div>
      </Container>
    </nav>
  );
}
