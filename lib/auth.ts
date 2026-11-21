import { cookies } from "next/headers";
import { db } from "./db";
import { hashToken } from "./security";
import type { Role } from "@prisma/client";
export async function currentUser(){ const token=(await cookies()).get("hr_session")?.value; if(!token)return null; const s=await db.session.findUnique({where:{tokenHash:hashToken(token)},include:{user:true}}); if(!s||s.expiresAt<new Date())return null; return s.user; }
export async function requireUser(roles?:Role[]){ const user=await currentUser(); if(!user) throw new Error("UNAUTHENTICATED"); if(roles&&!roles.includes(user.role)) throw new Error("FORBIDDEN"); return user; }
