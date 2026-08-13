/**
 * Indicador numérico al lado de un título o link del panel.
 *
 * Se usa en la ficha del socio (cuántos registros tiene cada sección) y en el
 * nav del socio. En cero baja el contraste: "no hay nada cargado" no debería
 * pesar visualmente igual que un dato real.
 */
export function Contador({ n }: { n: number }) {
  return (
    <span
      className={`ml-2 inline-block rounded-pill border border-border px-2 py-0.5 align-middle text-xs font-semibold tabular-nums ${
        n === 0 ? "text-muted/60" : "bg-surface-2 text-text"
      }`}
    >
      {n}
    </span>
  );
}
