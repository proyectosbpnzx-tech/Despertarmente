import { Section } from "@/components/ui/Section";
import { Pendiente } from "@/components/ui/Pendiente";
import { esPendiente, type FaqContent } from "@/content/types";

/** FAQ accesible sin JS (details/summary). Desarma objeciones antes del cierre. */
export function FAQ({ content }: { content: FaqContent }) {
  return (
    <Section id={content.id} heading={content.heading}>
      <div className="divide-y divide-border border-y border-border">
        {content.items.map((item) => (
          <details key={item.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-text">
              {item.q}
              <span
                aria-hidden
                className="text-accent-soft transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="mt-3 text-muted">
              {esPendiente(item.a) ? (
                <Pendiente>{item.a}</Pendiente>
              ) : (
                <p>{item.a}</p>
              )}
            </div>
          </details>
        ))}
      </div>
    </Section>
  );
}
