import { requireStaff } from "@/lib/auth";
import { StaffNav } from "@/components/staff/StaffNav";

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
