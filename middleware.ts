import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

/**
 * CRÍTICO: el matcher lista solo las rutas del panel.
 *
 * `updateSession` manda al login a todo visitante sin sesión. Cuando el panel
 * era una app aparte, matchear todo era correcto porque todo era privado. Acá
 * convive con el sitio público: si esto volviera a ser un matcher amplio,
 * cualquiera que entre a la home terminaría en /login.
 *
 * Al agregar rutas privadas nuevas hay que sumarlas explícitamente acá.
 */
export const config = {
  matcher: ["/login", "/cambiar-clave", "/panel/:path*", "/mi-progreso/:path*"],
};
