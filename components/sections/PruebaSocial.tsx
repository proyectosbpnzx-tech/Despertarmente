import { Section } from "@/components/ui/Section";
import { esPendiente, type PruebaSocialContent } from "@/content/types";

/** Prensa (La Posta, VDP) + comunidad de Instagram. Prueba social real. */
export function PruebaSocial({ content }: { content: PruebaSocialContent }) {
  return (
    <Section id={content.id} heading={content.heading} intro={content.intro}>
      <div className="grid gap-5 sm:grid-cols-3">
        {/* Comunidad */}
        <div className="rounded-card border border-border bg-surface p-6">
          <p className="font-display text-4xl font-bold text-accent-soft">
            {content.comunidad.seguidores}
          </p>
          <p className="mt-1 text-muted">
            seguidores en {content.comunidad.plataforma}
          </p>
        </div>

        {/* Notas de prensa */}
        {content.prensa.map((n) => {
          const linkable = n.url && !esPendiente(n.url);
          const inner = (
            <>
              <p className="text-sm uppercase tracking-wide text-accent-soft">
                En los medios
              </p>
              <p className="mt-2 text-lg font-semibold text-text">{n.medio}</p>
              {n.titulo && <p className="mt-1 text-sm text-muted">{n.titulo}</p>}
              {!linkable && (
                <p className="mt-2 text-xs text-muted/70">
                  [[PENDIENTE: URL de la nota]]
                </p>
              )}
            </>
          );
          return linkable ? (
            <a
              key={n.medio}
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-card border border-border bg-surface p-6 transition-colors hover:border-accent"
            >
              {inner}
            </a>
          ) : (
            <div
              key={n.medio}
              className="rounded-card border border-border bg-surface p-6"
            >
              {inner}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
