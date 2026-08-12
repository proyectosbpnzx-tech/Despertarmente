import type { Metadata } from "next";
import { requireSocio } from "@/lib/auth";
import { MemberNav } from "@/components/panel/member/MemberNav";

// Comparte dominio con el sitio público: nunca indexar.
export const metadata: Metadata = {
  title: "Mi progreso — Despertarmente",
  robots: { index: false, follow: false },
};

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
