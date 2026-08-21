export const ADMIN_EMAIL = "mr.papas001@gmail.com";

export function isAdminEmail(email?: string | null): boolean {
  return (email ?? "").toLowerCase().trim() === ADMIN_EMAIL;
}
