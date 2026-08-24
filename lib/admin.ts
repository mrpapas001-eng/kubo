export const ADMIN_EMAIL = "contacto.kuboanuncios@gmail.com";

export function isAdminEmail(email?: string | null): boolean {
  return (email ?? "").toLowerCase().trim() === ADMIN_EMAIL;
}