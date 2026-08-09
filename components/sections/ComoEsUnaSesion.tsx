import { Section } from "@/components/ui/Section";
import { Pendiente } from "@/components/ui/Pendiente";
import { esPendiente, type SesionContent } from "@/content/types";

/**
 * Núcleo anti-vaguedad: responde "¿qué me van a hacer y para qué me sirve?".
 * Si aún no hay pasos reales, muestra el marcador pendiente.
 */
export function ComoEsUnaSesion({ content }: { content: SesionContent }) {
  const tieneDuracion = content.duracion && !esPendiente(content.duracion);

  return (
    <Section
      id={content.id}
      heading={content.heading}
      accent="sesión"
      intro={content.intro}
      tone="surface"
    >
      {tieneDuracion && (
        <p className="mb-6 inline-block rounded-pill border border-border bg-bg px-4 py-1.5 text-sm text-muted">
          Duración: {content.duracion}
        </p>
      )}

      {content.pasos.length > 0 ? (
        <ol className="space-y-5">
          {content.pasos.map((paso, i) => (
            <li
              key={paso.title}
              className="flex gap-4 rounded-card border border-border bg-bg p-5"
            >
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-accent/15 font-display text-lg font-bold text-accent-soft"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-text">{paso.title}</h3>
                <p className="mt-1 text-muted">{paso.body}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        content.pendiente && <Pendiente>{content.pendiente}</Pendiente>
      )}
    </Section>
  );
}
