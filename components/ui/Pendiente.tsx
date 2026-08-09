import { esPendiente } from "@/content/types";

/** Quita el envoltorio `[[PENDIENTE: ... ]]` para mostrar solo la descripción. */
export function textoPendiente(valor: string): string {
  return valor.replace(/^\s*\[\[PENDIENTE:?\s*/i, "").replace(/\]\]\s*$/i, "").trim();
}

interface PendienteProps {
  /** Descripción del hueco (puede venir envuelta en P() o ser texto plano). */
  children: string;
}

/**
 * Marcador visible de contenido faltante. Se muestra SIEMPRE (el sitio aún no
 * se publicó) para que ningún hueco pase desapercibido. Ver skill copy-es-ar:
 * política de no inventar.
 */
export function Pendiente({ children }: PendienteProps) {
  return (
    <div
      role="note"
      className="my-4 flex items-start gap-3 rounded-card border border-dashed border-accent/60 bg-accent/5 p-4 text-left"
    >
      <span aria-hidden className="mt-0.5 text-accent-soft">
        ◆
      </span>
      <p className="text-sm text-muted">
        <span className="font-semibold uppercase tracking-wide text-accent-soft">
          Pendiente:{" "}
        </span>
        {textoPendiente(children)}
        <span className="mt-1 block text-xs text-muted/70">
          (Este bloque se completa con datos reales de Jonatan.)
        </span>
      </p>
    </div>
  );
}

interface TextoConPendienteProps {
  valor: string;
  className?: string;
}

/**
 * Renderiza un string que PODRÍA ser un marcador [[PENDIENTE]]: si lo es, muestra
 * <Pendiente>; si no, muestra el texto normal.
 */
export function TextoConPendiente({ valor, className }: TextoConPendienteProps) {
  if (esPendiente(valor)) return <Pendiente>{valor}</Pendiente>;
  return <p className={className}>{valor}</p>;
}
