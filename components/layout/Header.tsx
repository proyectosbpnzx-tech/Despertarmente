import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/brand/Logo";
import { DASHBOARD_URL } from "@/lib/dashboard";

/** Header sticky con logo (link a inicio). La conversión a WhatsApp queda a cargo del ícono flotante. */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-bg/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          aria-label="Despertarmente — inicio"
          className="rounded-md"
        >
          <Logo size="sm" />
        </Link>
        <a
          href={DASHBOARD_URL}
          className="rounded-md text-sm text-muted transition-colors hover:text-accent-soft"
        >
          Login
        </a>
      </Container>
    </header>
  );
}
