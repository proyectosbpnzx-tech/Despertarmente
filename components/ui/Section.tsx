import type { ReactNode } from "react";
import { Container } from "./Container";
import { AccentText } from "./AccentText";

interface SectionProps {
  /** id del landmark y ancla de navegación. */
  id: string;
  /** Título de la sección (se convierte en su nombre accesible vía aria-labelledby). */
  heading: string;
  /** Palabra/frase dentro de `heading` a resaltar en color de marca (opcional, uso puntual). */
  accent?: string;
  eyebrow?: string;
  intro?: string;
  /** Fondo alterno para ritmo visual. */
  tone?: "base" | "surface";
  children?: ReactNode;
}

/**
 * <section> semántico con jerarquía de headings correcta (siempre h2 bajo el h1
 * del Hero) y nombre accesible. Ver skill a11y-wcag.
 */
export function Section({
  id,
  heading,
  accent,
  eyebrow,
  intro,
  tone = "base",
  children,
}: SectionProps) {
  const bg = tone === "surface" ? "bg-surface" : "bg-bg";
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`${bg} py-16 sm:py-24 scroll-mt-20`}
    >
      <Container>
        {eyebrow && (
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent-soft">
            {eyebrow}
          </p>
        )}
        <h2
          id={`${id}-title`}
          className="text-3xl font-bold sm:text-4xl"
        >
          <AccentText text={heading} accent={accent} />
        </h2>
        {intro && (
          <p className="mt-4 max-w-2xl text-lg text-muted">{intro}</p>
        )}
        {children && <div className="mt-10">{children}</div>}
      </Container>
    </section>
  );
}
