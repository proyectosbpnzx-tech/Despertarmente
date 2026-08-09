import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/brand/Logo";

/** Header sticky con logo (link a inicio). La conversión a WhatsApp queda a cargo del ícono flotante. */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-bg/85 backdrop-blur">
      <Container className="flex h-16 items-center">
        <Link
          href="/"
          aria-label="Despertarmente — inicio"
          className="rounded-md"
        >
          <Logo size="sm" />
        </Link>
      </Container>
    </header>
  );
}
