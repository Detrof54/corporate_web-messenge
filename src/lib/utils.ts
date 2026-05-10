import type { ChatRole } from "@prisma/client";

//преобразование роли в человекопонятный вид
export function RoleLabel(role: ChatRole) {
  if (role === "OWNER") return "Владелец";
  if (role === "ADMIN") return "Администратор";
  return "Участник";
}



