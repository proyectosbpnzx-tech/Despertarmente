import { Section } from "@/components/ui/Section";
import { Pendiente } from "@/components/ui/Pendiente";
import type { QueEsContent } from "@/content/types";

/** Explica la neurociencia aplicada en términos concretos (anti-humo). */
export function QueEs({ content }: { content: QueEsContent }) {
  return (
    <Section
      id={content.id}
      heading={content.heading}
      accent="neurociencia"
      intro={content.intro}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {content.puntos.map((p) => (
          <div
            key={p.title}
            className="rounded-card border border-border bg-surface p-6 shadow-[var(--shadow-card)]"
          >
            <h3 className="text-xl font-semibold text-text">{p.title}</h3>
            <p className="mt-2 text-muted">{p.body}</p>
          </div>
        ))}
      </div>
      {content.pendiente && <Pendiente>{content.pendiente}</Pendiente>}
    </Section>
  );
}
