"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { generateTempPassword } from "@/lib/passwords";

export interface CreateSocioState {
  error?: string;
  success?: { email: string; tempPassword: string };
}

export async function createSocio(
  _prevState: CreateSocioState,
  formData: FormData
): Promise<CreateSocioState> {
  // Un Server Action es un endpoint POST: el gateo del layout no alcanza,
  // cualquier usuario logueado puede invocarlo. Y abajo se usa el cliente
  // service-role, que bypassea RLS — sin este guard no queda nada frenando.
  await requireAdmin();

  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!fullName || !email) {
    return { error: "Nombre y email son obligatorios." };
  }

  const tempPassword = generateTempPassword();
  const admin = createAdminClient();

  const { error } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: fullName, phone, role: "socio" },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/panel/socios");
  return { success: { email, tempPassword } };
}
