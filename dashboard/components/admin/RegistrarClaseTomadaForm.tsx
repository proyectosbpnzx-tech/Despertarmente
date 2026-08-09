"use client";

import { useActionState, useRef, useEffect } from "react";
import {
  registrarClaseTomada,
  type RegistrarClaseTomadaState,
} from "@/app/(admin)/admin/socios/[id]/actions";
import type { Clase } from "@/lib/types";

const initialState: RegistrarClaseTomadaState = {};

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function RegistrarClaseTomadaForm({
  socioId,
  clases,
}: {
  socioId: string;
  clases: Clase[];
}) {
  const action = registrarClaseTomada.bind(null, socioId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <div className="rounded-card border border-border bg-surface p-6">
      <h2 className="font-display text-lg font-bold text-text">Registrar clase tomada</h2>

      <form ref={formRef} action={formAction} className="mt-4 flex flex-col gap-4" noValidate>
        <label className="flex flex-col gap-1.5 text-sm text-muted">
          Clase
          <select
            name="clase_id"
            required
            defaultValue=""
            className="rounded-[0.6rem] border border-border bg-bg px-3 py-2.5 text-text outline-none focus-visible:border-accent"
          >
            <option value="" disabled>
              Elegí una clase
            </option>
            {clases.map((clase) => (
              <option key={clase.id} value={clase.id}>
                {clase.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-muted">
          Fecha
          <input
            name="fecha"
            type="date"
            required
            defaultValue={today()}
            className="rounded-[0.6rem] border border-border bg-bg px-3 py-2.5 text-text outline-none focus-visible:border-accent"
          />
        </label>

        <label className="flex items-center gap-2 text-sm text-text">
          <input name="presente" type="checkbox" defaultChecked className="h-4 w-4" />
          Estuvo presente
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-muted">
          Notas (opcional)
          <input
            name="notas"
            type="text"
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
          {pending ? "Guardando…" : "Registrar"}
        </button>
      </form>
    </div>
  );
}
