import type { Metadata } from "next";
import { requireStaff } from "@/lib/auth";
import { StaffNav } from "@/components/panel/staff/StaffNav";

// Comparte dominio con el sitio público: nunca indexar.
export const metadata: Metadata = {
  title: "Panel — Despertarmente",
  robots: { index: false, follow: false },
};

/**
 * Panel de staff — admin y profesor. Al socio lo devuelve a /mi-progreso.
 * Lo que cada rol puede hacer dentro se resuelve página por página
 * (requireAdmin) y, en última instancia, en las policies de RLS.
 */
export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireStaff();

  return (
    <>
      <StaffNav role={profile.role} />
      {children}
    </>
  );
}
