import { requireSocio } from "@/lib/auth";
import { MemberNav } from "@/components/member/MemberNav";

/**
 * Panel de socio — solo lectura de lo suyo. Al staff lo manda a /panel.
 * El socio nunca escribe su propio progreso: eso lo carga el staff.
 */
export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  await requireSocio();

  return (
    <>
      <MemberNav />
      {children}
    </>
  );
}
