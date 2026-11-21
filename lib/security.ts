import crypto from "node:crypto";
import bcrypt from "bcryptjs";
export const hashPassword = (value:string) => bcrypt.hash(value, 12);
export const verifyPassword = (value:string, hash:string) => bcrypt.compare(value, hash);
export const hashToken = (value:string) => crypto.createHash("sha256").update(value).digest("hex");
export const newToken = () => crypto.randomBytes(32).toString("hex");
export const hashIp = (ip:string) => hashToken(`${ip}:${process.env.SESSION_SECRET ?? "dev"}`);
