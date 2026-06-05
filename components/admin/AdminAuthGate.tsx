"use client";

import { createContext, useContext, useMemo } from "react";

const AdminTokenContext = createContext<{ token: string } | null>(null);

export function useAdminToken() {
  const context = useContext(AdminTokenContext);
  if (!context) throw new Error("useAdminToken must be used inside AdminAuthGate");
  return context;
}

export default function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const value = useMemo(() => ({ token: "" }), []);
  return <AdminTokenContext.Provider value={value}>{children}</AdminTokenContext.Provider>;
}
