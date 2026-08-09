"use client";

import { useActionState, useRef, useEffect } from "react";
import { createProfesor, type CreateProfesorState } from "@/app/(admin)/admin/profesores/actions";

const initialState: CreateProfesorState = {};

export function NuevoProfesorForm() {
  const [state, formAction, pending] = useActionState(createProfesor, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <div className="rounded-card border border-border bg-surface p-6">
      <h2 className="font-display text-lg font-bold text-text">Nuevo profesor</h2>

      <form ref={formRef} action={formAction} className="mt-4 flex flex-col gap-4" noValidate>
        <label className="flex flex-col gap-1.5 text-sm text-muted">
          Nombre completo
          <input
            name="nombre_completo"
            type="text"
            required
            className="rounded-[0.6rem] border border-border bg-bg px-3 py-2.5 text-text outline-none focus-visible:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-muted">
          Especialidad (opcional)
          <input
            name="especialidad"
            type="text"
            placeholder="Ej. Funcional, Yoga"
            className="rounded-[0.6rem] border border-border bg-bg px-3 py-2.5 text-text outline-none focus-visible:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-muted">
          Teléfono (opcional)
          <input
            name="telefono"
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
          {pending ? "Creando…" : "Crear profesor"}
        </button>
      </form>
    </div>
  );
}
