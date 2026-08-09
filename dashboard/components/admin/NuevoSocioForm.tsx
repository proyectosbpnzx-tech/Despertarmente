"use client";

import { useActionState, useRef, useEffect } from "react";
import { createSocio, type CreateSocioState } from "@/app/(admin)/admin/socios/actions";

const initialState: CreateSocioState = {};

export function NuevoSocioForm() {
  const [state, formAction, pending] = useActionState(createSocio, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <div className="rounded-card border border-border bg-surface p-6">
      <h2 className="font-display text-lg font-bold text-text">Nuevo socio</h2>

      <form ref={formRef} action={formAction} className="mt-4 flex flex-col gap-4" noValidate>
        <label className="flex flex-col gap-1.5 text-sm text-muted">
          Nombre completo
          <input
            name="full_name"
            type="text"
            required
            className="rounded-[0.6rem] border border-border bg-bg px-3 py-2.5 text-text outline-none focus-visible:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-muted">
          Email
          <input
            name="email"
            type="email"
            required
            className="rounded-[0.6rem] border border-border bg-bg px-3 py-2.5 text-text outline-none focus-visible:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-muted">
          Teléfono (opcional)
          <input
            name="phone"
            type="tel"
            className="rounded-[0.6rem] border border-border bg-bg px-3 py-2.5 text-text outline-none focus-visible:border-accent"
          />
        </label>

        {state.error && (
          <p role="alert" className="text-sm text-danger">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="self-start rounded-pill bg-accent px-4 py-2.5 font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Creando…" : "Crear socio"}
        </button>
      </form>

      {state.success && (
        <div role="status" className="mt-4 rounded-card border border-success/40 bg-success/10 p-4">
          <p className="text-sm font-semibold text-text">Socio creado.</p>
          <p className="mt-1 text-sm text-muted">
            Compartile estos datos por WhatsApp — la contraseña solo se muestra una vez:
          </p>
          <p className="mt-2 font-mono text-sm text-text">{state.success.email}</p>
          <p className="font-mono text-sm text-text">{state.success.tempPassword}</p>
        </div>
      )}
    </div>
  );
}
