import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, must_change_password")
    .eq("id", user.id)
    .single<Pick<Profile, "role" | "must_change_password">>();

  if (!profile) {
    redirect("/login");
  }

  if (profile.must_change_password) {
    redirect("/cambiar-clave");
  }

  redirect(profile.role === "admin" ? "/admin" : "/mi-progreso");
}
