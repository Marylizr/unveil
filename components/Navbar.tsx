"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import BrandLogo from "./BrandLogo";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 12);

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  const links = [
    { href: "/products", label: t.nav.shop },
    { href: "/learn", label: t.nav.learn },
    { href: "/about", label: t.nav.about },
  ];

  void isScrolled;

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#91854a]/35 bg-[#efe9df] text-[#445024] shadow-[0_10px_30px_rgba(26,32,16,0.08)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="block transition-opacity hover:opacity-80" onClick={() => setIsOpen(false)} aria-label="UNVEIL home">
          <BrandLogo variant="dark" context="nav" />
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="font-sans text-sm tracking-wide text-[#445024] hover:text-[#91854a] transition-colors uppercase">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link
            href="/admin"
            className="hidden md:inline-flex font-sans text-xs tracking-widest uppercase border border-[#91854a]/45 text-[#445024] px-4 py-2 hover:border-[#91854a] hover:bg-[#91854a] hover:text-[#efe9df] transition-all duration-300"
          >
            Admin
          </Link>
          <Link
            href="#newsletter"
            className="hidden md:inline-flex font-sans text-xs tracking-widest uppercase border border-[#91854a]/45 text-[#445024] px-4 py-2 hover:border-[#91854a] hover:bg-[#91854a] hover:text-[#efe9df] transition-all duration-300"
          >
            {t.nav.joinWaitlist}
          </Link>
          <button
            type="button"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen((open) => !open)}
            className="md:hidden font-sans text-xs uppercase tracking-widest text-[#445024] border border-[#91854a]/45 px-3 py-2 hover:border-[#91854a] hover:bg-[#91854a] hover:text-[#efe9df] transition-all duration-300"
          >
            {isOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {isOpen && (
        <nav id="mobile-navigation" className="md:hidden border-t border-[#91854a]/25 bg-[#efe9df] px-6 py-5">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-sans text-sm uppercase tracking-widest text-[#445024] hover:text-[#91854a] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="mt-2 inline-flex w-fit font-sans text-xs tracking-widest uppercase border border-[#91854a]/45 text-[#445024] px-4 py-2 hover:border-[#91854a] hover:bg-[#91854a] hover:text-[#efe9df] transition-all duration-300"
            >
              Admin
            </Link>
            <Link
              href="#newsletter"
              onClick={() => setIsOpen(false)}
              className="mt-2 inline-flex w-fit font-sans text-xs tracking-widest uppercase border border-[#91854a]/45 text-[#445024] px-4 py-2 hover:border-[#91854a] hover:bg-[#91854a] hover:text-[#efe9df] transition-all duration-300"
            >
              {t.nav.joinWaitlist}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
