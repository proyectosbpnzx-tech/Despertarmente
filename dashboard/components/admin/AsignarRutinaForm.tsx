"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import {
  asignarRutina,
  type AsignarRutinaState,
} from "@/app/(admin)/admin/socios/[id]/actions";
import type { Ejercicio } from "@/lib/types";

const initialState: AsignarRutinaState = {};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function filaVacia(): Ejercicio {
  return { nombre: "", series: "", reps: "", descanso: "", notas: "" };
}

export function AsignarRutinaForm({ socioId }: { socioId: string }) {
  const action = asignarRutina.bind(null, socioId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([filaVacia()]);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setEjercicios([filaVacia()]);
    }
  }, [state.success]);

  function actualizarFila(index: number, campo: keyof Ejercicio, valor: string) {
    setEjercicios((prev) =>
      prev.map((fila, i) => (i === index ? { ...fila, [campo]: valor } : fila))
    );
  }

  function agregarFila() {
    setEjercicios((prev) => [...prev, filaVacia()]);
  }

  function quitarFila(index: number) {
    setEjercicios((prev) => prev.filter((_, i) => i !== index));
  }

  const inputClass =
    "rounded-[0.5rem] border border-border bg-bg px-2.5 py-2 text-sm text-text outline-none focus-visible:border-accent";

  return (
    <div className="rounded-card border border-border bg-surface p-6">
      <h2 className="font-display text-lg font-bold text-text">Asignar rutina</h2>

      <form ref={formRef} action={formAction} className="mt-4 flex flex-col gap-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm text-muted">
            Nombre de la rutina
            <input
              name="nombre"
              type="text"
              placeholder="Ej. Fuerza — fase 1"
              required
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-muted">
            Fecha de inicio
            <input name="fecha_inicio" type="date" required defaultValue={today()} className={inputClass} />
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-sm text-muted">
          Descripción (opcional)
          <input name="descripcion" type="text" className={inputClass} />
        </label>

        <div>
          <p className="mb-2 text-sm text-muted">Ejercicios</p>

          <div className="flex flex-col gap-3">
            {ejercicios.map((fila, index) => (
              <div
                key={index}
                className="grid grid-cols-2 gap-2 rounded-[0.6rem] border border-border p-3 sm:grid-cols-5"
              >
                <input
                  value={fila.nombre}
                  onChange={(e) => actualizarFila(index, "nombre", e.target.value)}
                  placeholder="Ejercicio"
                  className={`${inputClass} col-span-2 sm:col-span-1`}
                />
                <input
                  value={fila.series}
                  onChange={(e) => actualizarFila(index, "series", e.target.value)}
                  placeholder="Series"
                  className={inputClass}
                />
                <input
                  value={fila.reps}
                  onChange={(e) => actualizarFila(index, "reps", e.target.value)}
                  placeholder="Reps"
                  className={inputClass}
                />
                <input
                  value={fila.descanso}
                  onChange={(e) => actualizarFila(index, "descanso", e.target.value)}
                  placeholder="Descanso"
                  className={inputClass}
                />
                <div className="flex gap-2">
                  <input
                    value={fila.notas}
                    onChange={(e) => actualizarFila(index, "notas", e.target.value)}
                    placeholder="Notas"
                    className={`${inputClass} flex-1`}
                  />
                  {ejercicios.length > 1 && (
                    <button
                      type="button"
                      onClick={() => quitarFila(index)}
                      aria-label="Quitar ejercicio"
                      className="px-2 text-danger"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={agregarFila}
            className="mt-3 text-sm text-accent-soft underline-offset-2 hover:underline"
          >
            + Agregar ejercicio
          </button>
        </div>

        <input type="hidden" name="ejercicios_json" value={JSON.stringify(ejercicios)} readOnly />

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
          {pending ? "Guardando…" : "Asignar rutina"}
        </button>
      </form>
    </div>
  );
}
