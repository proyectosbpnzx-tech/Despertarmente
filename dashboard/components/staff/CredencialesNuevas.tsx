/**
 * Credenciales de un alta recién creada. La clave temporal se muestra una
 * sola vez: no queda guardada en ningún lado en texto plano.
 */
export function CredencialesNuevas({
  titulo,
  email,
  tempPassword,
}: {
  titulo: string;
  email: string;
  tempPassword: string;
}) {
  return (
    <div role="status" className="mt-4 rounded-card border border-success/40 bg-success/10 p-4">
      <p className="text-sm font-semibold text-text">{titulo}</p>
      <p className="mt-1 text-sm text-muted">
        Compartile estos datos por WhatsApp — la contraseña solo se muestra una vez:
      </p>
      <p className="mt-2 font-mono text-sm text-text">{email}</p>
      <p className="font-mono text-sm text-text">{tempPassword}</p>
    </div>
  );
}
