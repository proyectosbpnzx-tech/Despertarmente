import { Section } from "@/components/ui/Section";
import type { ParaQuienContent } from "@/content/types";

/** Deja claro que el público es transversal a la disciplina (no solo fútbol). */
export function ParaQuien({ content }: { content: ParaQuienContent }) {
  return (
    <Section id={content.id} heading={content.heading} intro={content.intro} tone="surface">
      <ul className="flex flex-wrap gap-2.5" aria-label="Disciplinas">
        {content.disciplinas.map((d) => (
          <li
            key={d}
            className="rounded-pill border border-border bg-bg px-4 py-2 text-sm font-medium text-text"
          >
            {d}
          </li>
        ))}
      </ul>
      {content.outro && (
        <p className="mt-8 text-lg text-muted">{content.outro}</p>
      )}
    </Section>
  );
}
