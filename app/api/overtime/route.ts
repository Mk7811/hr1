import {NextResponse} from "next/server";
import {currentUser} from "@/lib/auth";
import {db} from "@/lib/db";
import {overtimeSchema} from "@/lib/validation";
import {overtimeAmountCents} from "@/lib/calculations";

export async function POST(req:Request){
  const user=await currentUser(); if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
  const parsed=overtimeSchema.safeParse(await req.json()); if(!parsed.success)return NextResponse.json({error:"Invalid input"},{status:400});
  const {date,hours,reason}=parsed.data;
  const request=await db.overtimeRequest.create({data:{userId:user.id,date,hours,reason,amountCents:overtimeAmountCents(user.salaryCents,hours)}});
  await db.auditLog.create({data:{userId:user.id,action:"CREATE",entity:"OvertimeRequest",entityId:request.id}});
  return NextResponse.json({id:request.id,amountCents:request.amountCents,status:request.status},{status:201});
}
