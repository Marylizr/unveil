"use client";

import { usePathname } from "next/navigation";
import AdminAuthGate from "@/components/admin/AdminAuthGate";
import AdminShell from "@/components/admin/AdminShell";
import AdminStyles from "@/components/admin/AdminStyles";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return (
      <>
        <AdminStyles />
        {children}
      </>
    );
  }

  return (
    <AdminAuthGate>
      <AdminStyles />
      <AdminShell>{children}</AdminShell>
    </AdminAuthGate>
  );
}
