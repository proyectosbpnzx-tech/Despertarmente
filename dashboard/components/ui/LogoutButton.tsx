"use client";

import { useFormStatus } from "react-dom";
import { logout } from "@/lib/actions/auth";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="text-sm text-muted underline-offset-4 transition-colors hover:text-accent-soft disabled:opacity-60"
    >
      {pending ? "Saliendo…" : label}
    </button>
  );
}

export function LogoutButton({
  className,
  label = "Cerrar sesión",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <form action={logout} className={className}>
      <SubmitButton label={label} />
    </form>
  );
}
