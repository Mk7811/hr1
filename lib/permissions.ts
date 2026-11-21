import type { Role } from "@prisma/client";

export const managementRoles: Role[] = ["MANAGER", "HR", "ADMIN"];
export const hrRoles: Role[] = ["HR", "ADMIN"];
export function hasRole(role: Role, allowed: Role[]) { return allowed.includes(role); }
