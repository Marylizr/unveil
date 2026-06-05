import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin/session";

export async function GET() {
  cookies().set(ADMIN_SESSION_COOKIE, "", { maxAge: 0, path: "/admin" });
  redirect("/admin/login");
}

export async function POST() {
  cookies().set(ADMIN_SESSION_COOKIE, "", { maxAge: 0, path: "/admin" });
  redirect("/admin/login");
}
