import type { Metadata } from "next";
import { currentUser } from "@/lib/auth";
import { Sidebar } from "@/app/components/sidebar";
import "./globals.css";
export const metadata: Metadata = { title: "Smart HR Agent", description: "A secure, modern human resources management platform" };
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { const user = await currentUser(); return <html lang="en" dir="ltr"><body><div className="app-layout"><Sidebar user={user ? { name: user.name, role: user.role } : null} /><main className="main-content">{children}</main></div></body></html>; }
