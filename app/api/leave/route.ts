import {NextResponse} from "next/server";
import {currentUser} from "@/lib/auth";
import {db} from "@/lib/db";
import {leaveSchema} from "@/lib/validation";
import {leaveDays} from "@/lib/calculations";

export async function POST(req:Request){
  const user=await currentUser(); if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
  const parsed=leaveSchema.safeParse(await req.json()); if(!parsed.success)return NextResponse.json({error:"Invalid input"},{status:400});
  const {type,startDate,endDate,reason}=parsed.data; if(endDate<startDate)return NextResponse.json({error:"Invalid dates"},{status:400});
  const request=await db.leaveRequest.create({data:{userId:user.id,type,startDate,endDate,days:leaveDays(startDate,endDate),reason}});
  await db.auditLog.create({data:{userId:user.id,action:"CREATE",entity:"LeaveRequest",entityId:request.id}});
  return NextResponse.json({id:request.id,status:request.status},{status:201});
}
