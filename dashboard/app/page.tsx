import { redirect } from "next/navigation";
import { getSessionProfile, panelHome } from "@/lib/auth";

/** Puerta de entrada: manda a cada rol al panel que le corresponde. */
export default async function HomePage() {
  const profile = await getSessionProfile();

  if (!profile) {
    redirect("/login");
  }
  if (profile.must_change_password) {
    redirect("/cambiar-clave");
  }

  redirect(panelHome(profile.role));
}
