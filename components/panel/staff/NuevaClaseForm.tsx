"use client";

import { useActionState, useRef, useEffect } from "react";
import { createClase, type CreateClaseState } from "@/app/(staff)/panel/clases/actions";
import type { Profesor } from "@/lib/types";

const initialState: CreateClaseState = {};

const DIAS: { value: string; label: string }[] = [
  { value: "lunes", label: "Lunes" },
  { value: "martes", label: "Martes" },
  { value: "miercoles", label: "Miércoles" },
  { value: "jueves", label: "Jueves" },
  { value: "viernes", label: "Viernes" },
  { value: "sabado", label: "Sábado" },
  { value: "domingo", label: "Domingo" },
];

export function NuevaClaseForm({ profesores }: { profesores: Profesor[] }) {
  const [state, formAction, pending] = useActionState(createClase, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <div className="rounded-card border border-border bg-surface p-6">
      <h2 className="font-display text-lg font-bold text-text">Nueva clase</h2>

      <form ref={formRef} action={formAction} className="mt-4 flex flex-col gap-4" noValidate>
        <label className="flex flex-col gap-1.5 text-sm text-muted">
          Nombre
          <input
            name="nombre"
            type="text"
            placeholder="Ej. Funcional"
            required
            className="rounded-[0.6rem] border border-border bg-bg px-3 py-2.5 text-text outline-none focus-visible:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-muted">
          Profesor (opcional)
          <select
            name="profesor_id"
            defaultValue=""
            className="rounded-[0.6rem] border border-border bg-bg px-3 py-2.5 text-text outline-none focus-visible:border-accent"
          >
            <option value="">Sin asignar</option>
            {profesores.map((profesor) => (
              <option key={profesor.id} value={profesor.id}>
                {profesor.nombre_completo}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5 text-sm text-muted">
            Día (opcional)
            <select
              name="dia_semana"
              defaultValue=""
              className="rounded-[0.6rem] border border-border bg-bg px-3 py-2.5 text-text outline-none focus-visible:border-accent"
            >
              <option value="">—</option>
              {DIAS.map((dia) => (
                <option key={dia.value} value={dia.value}>
                  {dia.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-muted">
            Horario (opcional)
            <input
              name="horario"
              type="text"
              placeholder="Ej. 18:30"
              className="rounded-[0.6rem] border border-border bg-bg px-3 py-2.5 text-text outline-none focus-visible:border-accent"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-sm text-muted">
          Cupo (opcional)
          <input
            name="cupo"
            type="number"
            min={1}
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
          {pending ? "Creando…" : "Crear clase"}
        </button>
      </form>
    </div>
  );
}
