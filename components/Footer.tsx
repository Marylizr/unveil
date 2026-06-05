"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import BrandLogo from "./BrandLogo";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-deep border-t border-forest/30">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <BrandLogo variant="white" context="footer" />
            </div>
            <p className="font-sans text-sm text-sage leading-relaxed">{t.footer.tagline}</p>
            <div className="flex gap-4 mt-6">
              <a href="https://www.instagram.com/" aria-label="UNVEIL on Instagram" className="text-sage hover:text-mist transition-colors text-sm font-sans">IG</a>
              <a href="https://www.tiktok.com/" aria-label="UNVEIL on TikTok" className="text-sage hover:text-mist transition-colors text-sm font-sans">TT</a>
              <a href="https://open.spotify.com/" aria-label="UNVEIL on Spotify" className="text-sage hover:text-mist transition-colors text-sm font-sans">SP</a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-mist mb-4">{t.footer.shop}</p>
            <ul className="space-y-3">
              <li><Link href="/products" className="font-sans text-sm text-sage hover:text-cream transition-colors">{t.footer.links.allProducts}</Link></li>
              <li><Link href="/products" className="font-sans text-sm text-sage hover:text-cream transition-colors">{t.footer.links.newArrivals}</Link></li>
              <li><Link href="/products" className="font-sans text-sm text-sage hover:text-cream transition-colors">{t.footer.links.bestsellers}</Link></li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-mist mb-4">{t.footer.learn}</p>
            <ul className="space-y-3">
              <li><Link href="/learn" className="font-sans text-sm text-sage hover:text-cream transition-colors">{t.footer.links.allArticles}</Link></li>
              <li><Link href="/learn" className="font-sans text-sm text-sage hover:text-cream transition-colors">{t.footer.links.bodyLiteracy}</Link></li>
              <li><Link href="/learn" className="font-sans text-sm text-sage hover:text-cream transition-colors">{t.footer.links.health}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-mist mb-4">{t.footer.company}</p>
            <ul className="space-y-3">
              <li><Link href="/about" className="font-sans text-sm text-sage hover:text-cream transition-colors">{t.footer.links.about}</Link></li>
              <li><Link href="/about" className="font-sans text-sm text-sage hover:text-cream transition-colors">{t.footer.links.mission}</Link></li>
              <li><a href="mailto:hello@unveil.co" className="font-sans text-sm text-sage hover:text-cream transition-colors">{t.footer.links.contact}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-forest/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-xs text-sage/60">{t.footer.copyright}</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/privacy" className="font-sans text-xs text-sage/60 hover:text-sage transition-colors">{t.footer.privacy}</Link>
            <Link href="/terms" className="font-sans text-xs text-sage/60 hover:text-sage transition-colors">{t.footer.terms}</Link>
            <Link href="/shipping-returns" className="font-sans text-xs text-sage/60 hover:text-sage transition-colors">Shipping & Returns</Link>
            <Link href="/responsible-use" className="font-sans text-xs text-sage/60 hover:text-sage transition-colors">Responsible Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
