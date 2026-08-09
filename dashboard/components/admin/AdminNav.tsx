import Link from "next/link";
import { Container } from "@/components/ui/Container";

const LINKS = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/socios", label: "Socios" },
  { href: "/admin/profesores", label: "Profesores" },
  { href: "/admin/clases", label: "Clases" },
];

export function AdminNav() {
  return (
    <nav className="border-b border-border bg-surface">
      <Container className="max-w-4xl">
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
