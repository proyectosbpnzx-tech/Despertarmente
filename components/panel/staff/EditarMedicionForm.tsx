"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  actualizarMedicion,
  type RegistrarMedicionState,
} from "@/app/(staff)/panel/socios/[id]/actions";
import type { Medicion, Medida } from "@/lib/types";

const initialState: RegistrarMedicionState = {};

export function EditarMedicionForm({ socioId, medicion }: { socioId: string; medicion: Medicion }) {
  const action = actualizarMedicion.bind(null, socioId, medicion.id);
  const [state, formAction, pending] = useActionState(action, initialState);
  const [medidas, setMedidas] = useState<Medida[]>(medicion.medidas);

  function actualizarFila(index: number, campo: keyof Medida, valor: string) {
    setMedidas((prev) => prev.map((fila, i) => (i === index ? { ...fila, [campo]: valor } : fila)));
  }

  function agregarFila() {
    setMedidas((prev) => [...prev, { nombre: "", valor: "" }]);
  }

  function quitarFila(index: number) {
    setMedidas((prev) => prev.filter((_, i) => i !== index));
  }

  const inputClass =
    "rounded-[0.6rem] border border-border bg-bg px-3 py-2.5 text-text outline-none focus-visible:border-accent";

  if (state.success) {
    return (
      <div className="rounded-card border border-border bg-surface p-6">
        <p className="text-sm text-success">Medición actualizada.</p>
        <Link
          href={`/panel/socios/${socioId}`}
          className="mt-2 inline-block text-sm text-accent-soft underline-offset-2 hover:underline"
        >
          ← Volver a la ficha
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-border bg-surface p-6">
      <h2 className="font-display text-lg font-bold text-text">Editar medición</h2>

      <form action={formAction} className="mt-4 flex flex-col gap-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5 text-sm text-muted">
            Fecha
            <input
              name="fecha"
              type="date"
              required
              defaultValue={medicion.fecha}
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-muted">
            Peso (kg, opcional)
            <input
              name="peso_kg"
              type="number"
              step="0.1"
              min="0"
              defaultValue={medicion.peso_kg ?? ""}
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-muted">
            Grasa corporal (%, opcional)
            <input
              name="grasa_corporal_pct"
              type="number"
              step="0.1"
              min="0"
              max="100"
              defaultValue={medicion.grasa_corporal_pct ?? ""}
              className={inputClass}
            />
          </label>
        </div>

        <div>
          <p className="mb-2 text-sm text-muted">Otras medidas (opcional)</p>

          <div className="flex flex-col gap-2">
            {medidas.map((fila, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={fila.nombre}
                  onChange={(e) => actualizarFila(index, "nombre", e.target.value)}
                  placeholder="Ej. Cintura (cm)"
                  className={`${inputClass} flex-1 py-2 text-sm`}
                />
                <input
                  value={fila.valor}
                  onChange={(e) => actualizarFila(index, "valor", e.target.value)}
                  placeholder="Valor"
                  className={`${inputClass} w-28 py-2 text-sm`}
                />
                <button
                  type="button"
                  onClick={() => quitarFila(index)}
                  aria-label="Quitar medida"
                  className="px-2 text-danger"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={agregarFila}
            className="mt-2 text-sm text-accent-soft underline-offset-2 hover:underline"
          >
            + Agregar medida
          </button>
        </div>

        <label className="flex flex-col gap-1.5 text-sm text-muted">
          Notas (opcional)
          <input name="notas" type="text" defaultValue={medicion.notas ?? ""} className={inputClass} />
        </label>

        <input type="hidden" name="medidas_json" value={JSON.stringify(medidas)} readOnly />

        {state.error && (
          <p role="alert" className="text-sm text-danger">
            {state.error}
          </p>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            className="self-start rounded-pill bg-accent px-4 py-2.5 font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Guardando…" : "Guardar cambios"}
          </button>
          <Link
            href={`/panel/socios/${socioId}`}
            className="text-sm text-accent-soft underline-offset-2 hover:underline"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
