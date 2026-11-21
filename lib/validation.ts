import { z } from "zod";
export const loginSchema=z.object({email:z.string().email().max(200),password:z.string().min(8).max(100)});
export const leaveSchema=z.object({type:z.enum(["ANNUAL","SICK","EMERGENCY"]),startDate:z.coerce.date(),endDate:z.coerce.date(),reason:z.string().trim().min(3).max(1000)});
export const overtimeSchema=z.object({date:z.coerce.date(),hours:z.number().positive().max(24),reason:z.string().trim().min(3).max(1000)});
export const employeeCreateSchema=z.object({employeeId:z.string().trim().min(2).max(30),name:z.string().trim().min(2).max(120),email:z.string().email().max(200),password:z.string().min(8).max(100),role:z.enum(["EMPLOYEE","MANAGER","HR","ADMIN"]),department:z.string().trim().min(2).max(80),salaryCents:z.number().int().nonnegative().max(100000000)});
export const employeeUpdateSchema=employeeCreateSchema.omit({password:true}).partial().extend({password:z.string().min(8).max(100).optional()});
export const contractSchema=z.object({userId:z.string().min(1),contractNumber:z.string().trim().min(2).max(60),type:z.string().trim().min(2).max(40),startDate:z.coerce.date(),endDate:z.coerce.date().nullable().optional(),status:z.enum(["ACTIVE","EXPIRED","TERMINATED"]),salaryCents:z.number().int().nonnegative(),notes:z.string().trim().max(2000).optional()});
export const payrollSchema=z.object({userId:z.string().min(1),month:z.string().regex(/^\d{4}-\d{2}$/),grossCents:z.number().int().nonnegative(),deductionsCents:z.number().int().nonnegative(),status:z.enum(["DRAFT","PAID","CANCELLED"]),notes:z.string().trim().max(1000).optional()});
export type ChatMessage={role:"user"|"assistant"|"system";content:string};
