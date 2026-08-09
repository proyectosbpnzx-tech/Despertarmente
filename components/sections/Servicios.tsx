import { Section } from "@/components/ui/Section";
import { Pendiente } from "@/components/ui/Pendiente";
import { esPendiente, type ServiciosContent } from "@/content/types";

export function Servicios({ content }: { content: ServiciosContent }) {
  return (
    <Section id={content.id} heading={content.heading} intro={content.intro}>
      {content.items.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {content.items.map((s) => (
            <div
              key={s.nombre}
              className="rounded-card border border-border bg-surface p-6"
            >
              <h3 className="text-xl font-semibold text-text">{s.nombre}</h3>
              <p className="mt-2 text-muted">{s.descripcion}</p>
              <dl className="mt-4 space-y-1 text-sm text-muted">
                {s.modalidad && !esPendiente(s.modalidad) && (
                  <div className="flex gap-2">
                    <dt className="font-semibold text-text">Modalidad:</dt>
                    <dd>{s.modalidad}</dd>
                  </div>
                )}
                {s.precio && !esPendiente(s.precio) && (
                  <div className="flex gap-2">
                    <dt className="font-semibold text-text">Valor:</dt>
                    <dd>{s.precio}</dd>
                  </div>
                )}
              </dl>
            </div>
          ))}
        </div>
      ) : (
        content.pendiente && <Pendiente>{content.pendiente}</Pendiente>
      )}
    </Section>
  );
}
