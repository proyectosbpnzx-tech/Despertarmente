import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { MemberNav } from "@/components/member/MemberNav";

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
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

  if (!profile || profile.role !== "socio") {
    redirect("/admin");
  }

  if (profile.must_change_password) {
    redirect("/cambiar-clave");
  }

  return (
    <>
      <MemberNav />
      {children}
    </>
  );
}
