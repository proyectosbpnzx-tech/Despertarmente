"use client";

import { useActionState } from "react";
import { Container } from "@/components/ui/Container";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <main className="flex min-h-screen items-center">
      <Container className="max-w-sm">
        <h1 className="font-display text-2xl font-bold text-text">Ingresá a tu cuenta</h1>
        <p className="mt-1 text-sm text-muted">Panel de socios — Despertarmente.</p>

        <form action={formAction} className="mt-8 flex flex-col gap-4" noValidate>
          <label className="flex flex-col gap-1.5 text-sm text-muted">
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="rounded-[0.6rem] border border-border bg-surface px-3 py-2.5 text-text outline-none focus-visible:border-accent"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-muted">
            Contraseña
            <input
              name="password"
              type="password"
              autoComplete="current-password"
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
            {pending ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </Container>
    </main>
  );
}
