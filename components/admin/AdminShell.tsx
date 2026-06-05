"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/lead-magnets", label: "Lead Magnets" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/digital-assets", label: "Digital Assets" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/entitlements", label: "Entitlements" },
  { href: "/admin/leads", label: "Leads" },
];

function titleFromPath(pathname: string) {
  if (pathname === "/admin") return "Dashboard";
  if (pathname.startsWith("/admin/blog")) return "Blog";
  if (pathname.startsWith("/admin/products")) return "Products";
  if (pathname.startsWith("/admin/lead-magnets")) return "Lead Magnets";
  if (pathname.startsWith("/admin/media")) return "Media";
  if (pathname.startsWith("/admin/digital-assets")) return "Digital Assets";
  if (pathname.startsWith("/admin/orders")) return "Orders";
  if (pathname.startsWith("/admin/entitlements")) return "Entitlements";
  if (pathname.startsWith("/admin/leads")) return "Leads";
  return "UNVEIL CMS";
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f4f1e8] text-deep">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-forest/30 bg-deep px-5 py-6 text-cream lg:flex lg:flex-col">
        <Link href="/admin" className="mb-10 block transition-opacity hover:opacity-80" aria-label="UNVEIL CMS home">
          <BrandLogo variant="white" context="admin" />
          <span className="mt-3 block font-sans text-xs uppercase tracking-[0.3em] text-mist/70">Backoffice</span>
        </Link>

        <nav className="space-y-2">
          {links.map((link) => {
            const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-xl px-4 py-3 font-sans text-sm transition-colors ${
                  active ? "bg-mist text-deep" : "text-sage hover:bg-forest/45 hover:text-cream"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-2 border-t border-mist/15 pt-5">
          <Link href="/" className="block rounded-xl px-4 py-3 font-sans text-sm text-sage hover:bg-forest/45 hover:text-cream">
            View Site
          </Link>
          <form action="/admin/logout" method="post">
            <button className="block w-full rounded-xl px-4 py-3 text-left font-sans text-sm text-sage hover:bg-forest/45 hover:text-cream" type="submit">
              Logout
            </button>
          </form>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-olive/15 bg-[#f4f1e8]/95 px-5 py-4 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.24em] text-gold">UNVEIL CMS</p>
              <h1 className="font-sans text-2xl text-deep">{titleFromPath(pathname)}</h1>
            </div>
            <nav className="flex gap-2 overflow-x-auto lg:hidden">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-full border border-olive/20 px-3 py-2 font-sans text-xs uppercase tracking-widest text-olive">
                  {link.label}
                </Link>
              ))}
              <form action="/admin/logout" method="post">
                <button className="rounded-full border border-olive/20 px-3 py-2 font-sans text-xs uppercase tracking-widest text-olive" type="submit">
                  Logout
                </button>
              </form>
            </nav>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="admin-container">{children}</div>
        </main>
      </div>
    </div>
  );
}
