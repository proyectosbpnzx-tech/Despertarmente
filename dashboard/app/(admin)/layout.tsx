import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
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

  if (!profile || profile.role !== "admin") {
    redirect("/mi-progreso");
  }

  if (profile.must_change_password) {
    redirect("/cambiar-clave");
  }

  return (
    <>
      <AdminNav />
      {children}
    </>
  );
}
