import {NextResponse} from "next/server";
import {currentUser} from "@/lib/auth";
import {db} from "@/lib/db";
import {z} from "zod";

const statusSchema=z.object({status:z.enum(["APPROVED","REJECTED"])})
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){
  const user=await currentUser(); if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
  if(!["MANAGER","HR","ADMIN"].includes(user.role))return NextResponse.json({error:"Forbidden"},{status:403});
  const body=statusSchema.safeParse(await req.json()); if(!body.success)return NextResponse.json({error:"Invalid input"},{status:400});
  const id=(await params).id;
  const [leave,overtime]=await Promise.all([db.leaveRequest.findUnique({where:{id}}),db.overtimeRequest.findUnique({where:{id}})]);
  if(leave){const updated=await db.leaveRequest.update({where:{id},data:{status:body.data.status,reviewedBy:user.id}});await db.auditLog.create({data:{userId:user.id,action:"REVIEW",entity:"LeaveRequest",entityId:id,metadata:body.data.status}});return NextResponse.json(updated);}
  if(overtime){const updated=await db.overtimeRequest.update({where:{id},data:{status:body.data.status}});await db.auditLog.create({data:{userId:user.id,action:"REVIEW",entity:"OvertimeRequest",entityId:id,metadata:body.data.status}});return NextResponse.json(updated);}
  return NextResponse.json({error:"Not found"},{status:404});
}
