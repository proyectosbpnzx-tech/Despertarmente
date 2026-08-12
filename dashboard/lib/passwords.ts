import "server-only";
import { randomBytes } from "node:crypto";

/**
 * Clave temporal para un alta. Se le muestra una sola vez al admin, que la
 * pasa a la persona; en el primer ingreso el guard de must_change_password
 * la obliga a definir la suya (ver app/cambiar-clave).
 */
export function generateTempPassword(): string {
  return randomBytes(6).toString("base64url");
}
