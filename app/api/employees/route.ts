import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { managementRoles, hrRoles } from "@/lib/permissions";
import { employeeCreateSchema } from "@/lib/validation";
import { hashPassword } from "@/lib/security";

export async function GET(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!managementRoles.includes(user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  const employees = await db.user.findMany({ where: q ? { OR: [{ name: { contains: q } }, { email: { contains: q } }, { employeeId: { contains: q } }, { department: { contains: q } }] } : undefined, select: { id: true, employeeId: true, name: true, email: true, role: true, department: true, salaryCents: true, createdAt: true }, orderBy: { createdAt: "asc" } });
  return NextResponse.json({ employees });
}

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hrRoles.includes(user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = employeeCreateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  try { const employee = await db.user.create({ data: { ...parsed.data, passwordHash: await hashPassword(parsed.data.password) }, select: { id: true, employeeId: true, name: true, email: true, role: true, department: true, salaryCents: true } }); await db.auditLog.create({ data: { userId: user.id, action: "CREATE", entity: "User", entityId: employee.id } }); return NextResponse.json({ employee }, { status: 201 }); } catch { return NextResponse.json({ error: "Employee already exists" }, { status: 409 }); }
}
