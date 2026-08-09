"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export interface CreateSocioState {
  error?: string;
  success?: { email: string; tempPassword: string };
}

function generateTempPassword() {
  return randomBytes(6).toString("base64url");
}

export async function createSocio(
  _prevState: CreateSocioState,
  formData: FormData
): Promise<CreateSocioState> {
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

  revalidatePath("/admin/socios");
  return { success: { email, tempPassword } };
}
