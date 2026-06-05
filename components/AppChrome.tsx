"use client";

import { usePathname } from "next/navigation";
import CookieConsent from "@/components/CookieConsent";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isolated =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname === "/account" ||
    pathname === "/library" ||
    pathname === "/purchases" ||
    pathname === "/membership";

  if (isolated) return <main>{children}</main>;

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CookieConsent />
    </>
  );
}
