"use client";

import { useActionState } from "react";
import { Container } from "@/components/ui/Container";
import { changePassword, type ChangePasswordState } from "./actions";

const initialState: ChangePasswordState = {};

export default function CambiarClavePage() {
  const [state, formAction, pending] = useActionState(changePassword, initialState);

  return (
    <main className="flex min-h-screen items-center">
      <Container className="max-w-sm">
        <h1 className="font-display text-2xl font-bold text-text">Elegí tu contraseña</h1>
        <p className="mt-1 text-sm text-muted">
          Es tu primer ingreso. Definí una contraseña nueva para continuar.
        </p>

        <form action={formAction} className="mt-8 flex flex-col gap-4" noValidate>
          <label className="flex flex-col gap-1.5 text-sm text-muted">
            Contraseña nueva
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              className="rounded-[0.6rem] border border-border bg-surface px-3 py-2.5 text-text outline-none focus-visible:border-accent"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-muted">
            Repetí la contraseña
            <input
              name="confirm"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              className="rounded-[0.6rem] border border-border bg-surface px-3 py-2.5 text-text outline-none focus-visible:border-accent"
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
            className="mt-2 rounded-pill bg-accent px-4 py-2.5 font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Guardando…" : "Guardar y continuar"}
          </button>
        </form>
      </Container>
    </main>
  );
}
