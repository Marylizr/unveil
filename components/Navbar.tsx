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

  return (
    <header className={`glass fixed top-0 left-0 right-0 z-50 ${isScrolled ? "glass-scrolled" : ""}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="block transition-opacity hover:opacity-80" onClick={() => setIsOpen(false)} aria-label="UNVEIL home">
          <BrandLogo variant="white" context="nav" />
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="font-sans text-sm tracking-wide text-sage hover:text-cream transition-colors uppercase">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link
            href="#newsletter"
            className="hidden md:inline-flex font-sans text-xs tracking-widest uppercase border border-mist text-mist px-4 py-2 hover:bg-mist hover:text-deep transition-all duration-300"
          >
            {t.nav.joinWaitlist}
          </Link>
          <button
            type="button"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen((open) => !open)}
            className="md:hidden font-sans text-xs uppercase tracking-widest text-mist border border-mist/40 px-3 py-2"
          >
            {isOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {isOpen && (
        <nav id="mobile-navigation" className="md:hidden border-t border-mist/10 bg-deep px-6 py-5">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-sans text-sm uppercase tracking-widest text-sage hover:text-cream transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#newsletter"
              onClick={() => setIsOpen(false)}
              className="mt-2 inline-flex w-fit font-sans text-xs tracking-widest uppercase border border-mist text-mist px-4 py-2 hover:bg-mist hover:text-deep transition-all duration-300"
            >
              {t.nav.joinWaitlist}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
