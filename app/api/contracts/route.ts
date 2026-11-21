import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { hrRoles } from "@/lib/permissions";
import { contractSchema } from "@/lib/validation";

export async function GET() { const user = await currentUser(); if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); const contracts = await db.contract.findMany({ where: user.role === "EMPLOYEE" ? { userId: user.id } : undefined, include: { user: { select: { name: true, employeeId: true } } }, orderBy: { createdAt: "desc" } }); return NextResponse.json({ contracts }); }
export async function POST(req: Request) { const actor = await currentUser(); if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); if (!hrRoles.includes(actor.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 }); const parsed = contractSchema.safeParse(await req.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 }); try { const contract = await db.contract.create({ data: parsed.data }); await db.auditLog.create({ data: { userId: actor.id, action: "CREATE", entity: "Contract", entityId: contract.id } }); return NextResponse.json({ contract }, { status: 201 }); } catch { return NextResponse.json({ error: "Contract number already exists" }, { status: 409 }); } }
