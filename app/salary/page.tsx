import {currentUser} from "@/lib/auth"; import Link from "next/link";
export default async function Salary(){const user=await currentUser();if(!user)return <Link href="/login">Sign in</Link>;return <div className="card"><h1>My Salary</h1><p>Monthly base salary: {(user.salaryCents/100).toFixed(2)} OMR</p><p className="muted">Detailed payroll records are managed by HR.</p></div>}
