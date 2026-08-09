import { Container } from "@/components/ui/Container";
import { AccentText } from "@/components/ui/AccentText";
import type { HeroContent } from "@/content/types";

export function Hero({ content }: { content: HeroContent }) {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-bg"
    >
      {/* Glow de acento, decorativo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]"
      />
      <Container className="relative py-20 sm:py-28">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent-soft">
          {content.eyebrow}
        </p>
        <h1
          id="hero-title"
          className="mt-4 max-w-3xl text-4xl font-bold sm:text-6xl"
        >
          <AccentText text={content.title} accent="entrena" />
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted sm:text-xl">
          {content.subtitle}
        </p>
        {content.secondaryCta && (
          <div className="mt-9">
            <a
              href={content.secondaryCta.href}
              className="inline-flex items-center justify-center rounded-pill border border-accent-soft/50 px-6 py-3 text-base font-semibold text-accent-soft transition-colors hover:bg-accent/10"
            >
              {content.secondaryCta.label}
            </a>
          </div>
        )}
        {content.note && (
          <p className="mt-4 max-w-xl text-sm text-muted">{content.note}</p>
        )}
      </Container>

      <a
        href="#para-quien"
        aria-label="Ver más, bajar a la siguiente sección"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-bounce sm:block"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-8 w-8 text-accent-soft/70"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 9l6 6 6-6"
          />
        </svg>
      </a>
    </section>
  );
}
