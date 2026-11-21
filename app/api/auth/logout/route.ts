import {NextResponse} from "next/server"; import {cookies} from "next/headers"; import {db} from "@/lib/db"; import {hashToken} from "@/lib/security";
export async function POST(){const jar=await cookies();const token=jar.get("hr_session")?.value;if(token){await db.session.deleteMany({where:{tokenHash:hashToken(token)}});jar.delete("hr_session");}return NextResponse.json({ok:true});}
