"use client";

import { useActionState } from "react";
import { darAccesoProfesor, type DarAccesoState } from "@/app/(staff)/panel/profesores/actions";

const initialState: DarAccesoState = {};

/** Alta de acceso al panel para una ficha de profesor que todavía no lo tiene. */
export function DarAccesoForm({
  profesorId,
  nombreProfesor,
}: {
  profesorId: string;
  nombreProfesor: string;
}) {
  const darAcceso = darAccesoProfesor.bind(null, profesorId);
  const [state, formAction, pending] = useActionState(darAcceso, initialState);

  if (state.success) {
    return (
      <div role="status" className="text-sm">
        <p className="font-mono text-text">{state.success.email}</p>
        <p className="font-mono text-text">{state.success.tempPassword}</p>
        <p className="mt-1 text-xs text-muted">La clave se muestra una sola vez.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <label className="sr-only" htmlFor={`email-${profesorId}`}>
        Email para dar acceso a {nombreProfesor}
      </label>
      <input
        id={`email-${profesorId}`}
        name="email"
        type="email"
        required
        placeholder="email@ejemplo.com"
        className="min-w-0 flex-1 rounded-[0.6rem] border border-border bg-bg px-2.5 py-1.5 text-sm text-text outline-none focus-visible:border-accent"
      />
      <button
        type="submit"
        disabled={pending}
        className="shrink-0 text-sm text-accent-soft underline-offset-2 hover:underline disabled:opacity-60"
      >
        {pending ? "Creando…" : "Dar acceso"}
      </button>
      {state.error && (
        <p role="alert" className="w-full text-xs text-danger">
          {state.error}
        </p>
      )}
    </form>
  );
}
