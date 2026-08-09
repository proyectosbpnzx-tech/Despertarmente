import { Section } from "@/components/ui/Section";
import { Pendiente } from "@/components/ui/Pendiente";
import type { TestimoniosContent } from "@/content/types";

export function Testimonios({ content }: { content: TestimoniosContent }) {
  return (
    <Section id={content.id} heading={content.heading} tone="surface">
      {content.items.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {content.items.map((t) => (
            <figure
              key={t.nombre}
              className="rounded-card border border-border bg-bg p-6"
            >
              <blockquote className="text-lg text-text">“{t.texto}”</blockquote>
              <figcaption className="mt-4 text-sm text-muted">
                <span className="font-semibold text-text">{t.nombre}</span> ·{" "}
                {t.disciplina}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        content.pendiente && <Pendiente>{content.pendiente}</Pendiente>
      )}
    </Section>
  );
}
