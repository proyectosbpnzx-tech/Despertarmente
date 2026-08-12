"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { panelHome } from "@/lib/auth";
import type { Profile } from "@/lib/types";

export interface LoginState {
  error?: string;
}

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Completá email y contraseña." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { error: "Email o contraseña incorrectos." };
  }

  // Antes esto redirigía a "/" y ahí un dispatcher resolvía el rol. Ahora "/"
  // es el sitio público, así que el destino se calcula acá.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, must_change_password")
    .eq("id", data.user.id)
    .single<Pick<Profile, "role" | "must_change_password">>();

  if (!profile) {
    return { error: "Tu cuenta no tiene un perfil asociado. Avisale al administrador." };
  }

  redirect(profile.must_change_password ? "/cambiar-clave" : panelHome(profile.role));
}
