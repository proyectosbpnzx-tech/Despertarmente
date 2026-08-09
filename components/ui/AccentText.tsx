/**
 * Resalta la primera aparición de `accent` dentro de `text` en color de marca.
 * Si no hay match, devuelve el texto plano (nunca rompe el heading).
 */
export function AccentText({ text, accent }: { text: string; accent?: string }) {
  if (!accent) return <>{text}</>;

  const idx = text.toLowerCase().indexOf(accent.toLowerCase());
  if (idx === -1) return <>{text}</>;

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + accent.length);
  const after = text.slice(idx + accent.length);

  return (
    <>
      {before}
      <span className="text-accent">{match}</span>
      {after}
    </>
  );
}
