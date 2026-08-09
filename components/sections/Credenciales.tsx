import Image from "next/image";
import { Section } from "@/components/ui/Section";
import type { CredencialesContent } from "@/content/types";

/** Solo credenciales verificables de Jonatan. Sin inflar. */
export function Credenciales({ content }: { content: CredencialesContent }) {
  return (
    <Section id={content.id} heading={content.heading} tone="surface">
      <div className="grid gap-8 sm:grid-cols-[minmax(0,16rem)_1fr] sm:items-start">
        {/* Foto o placeholder pendiente */}
        {content.foto ? (
          <Image
            src={content.foto.src}
            alt={content.foto.alt}
            width={320}
            height={400}
            className="w-full rounded-card border border-border object-cover"
          />
        ) : (
          <div
            role="note"
            className="flex aspect-[4/5] w-full items-center justify-center rounded-card border border-dashed border-accent/60 bg-accent/5 p-4 text-center text-sm text-muted"
          >
            [[PENDIENTE: foto/retrato real de Jonatan]]
          </div>
        )}

        <div>
          <h3 className="text-2xl font-semibold text-text">{content.nombre}</h3>
          <p className="mt-1 text-accent-soft">{content.rol}</p>

          <div className="mt-4 space-y-3">
            {content.bio.map((parrafo, i) => (
              <p key={i} className="text-muted">
                {parrafo}
              </p>
            ))}
          </div>

          <ul className="mt-6 space-y-3">
            {content.credenciales.map((c) => (
              <li key={c} className="flex gap-3 text-text">
                <span aria-hidden className="mt-1 text-accent-soft">
                  ✓
                </span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
