import { redirect } from "next/navigation";
import { clearUserSessionCookie } from "@/lib/auth/userAuth";

export async function GET() {
  clearUserSessionCookie();
  redirect("/auth/login");
}

export async function POST() {
  clearUserSessionCookie();
  redirect("/auth/login");
}
