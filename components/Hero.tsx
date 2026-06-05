"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const fadeUp: Variants = {
  hidden: { opacity: 1, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const headline: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.22, delayChildren: 0.18 },
  },
};

const ctas: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { duration: 0.9, delay: 1.05, ease: [0.22, 1, 0.36, 1] },
  },
};

const lineReveal: Variants = {
  hidden: { scaleY: 0.35, opacity: 0.4 },
  visible: {
    scaleY: 1,
    opacity: 1,
    transition: { duration: 1.2, delay: 1.35, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const titleLines = t.hero.title.split("\n");
  const initial = shouldReduceMotion ? false : "hidden";
  const animate = "visible";

  return (
    <section className="relative min-h-screen bg-deep flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Subtle grain overlay */}
      <motion.div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
        }}
        initial={false}
        animate={shouldReduceMotion ? undefined : { scale: 1.03 }}
        transition={{ duration: 22, ease: "linear" }}
      />

      {/* Radial gradient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-forest/20 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <motion.p
          className="font-sans text-xs uppercase tracking-[0.3em] text-mist mb-8 opacity-80"
          variants={fadeUp}
          initial={initial}
          animate={animate}
        >
          {t.hero.eyebrow}
        </motion.p>

        {/* Main headline */}
        <motion.h1
          className="font-serif text-6xl md:text-8xl lg:text-9xl text-cream leading-[0.95] tracking-tight mb-10"
          variants={headline}
          initial={initial}
          animate={animate}
        >
          {titleLines.map((line) => (
            <motion.span key={line} className="block" variants={fadeUp}>
              {line}
            </motion.span>
          ))}
        </motion.h1>

        {/* Body */}
        <motion.p
          className="font-sans text-base md:text-lg text-sage/80 max-w-xl mx-auto leading-relaxed mb-12"
          variants={fadeUp}
          initial={initial}
          animate={animate}
          transition={{ duration: 0.9, delay: shouldReduceMotion ? 0 : 0.78, ease: [0.22, 1, 0.36, 1] }}
        >
          {t.hero.body}
        </motion.p>

        {/* CTAs */}
        <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4" variants={ctas} initial={initial} animate={animate}>
          <Link
            href="/products"
            className="font-sans text-xs tracking-widest uppercase bg-mist text-deep px-8 py-3.5 hover:bg-cream transition-colors duration-300"
          >
            {t.hero.cta1}
          </Link>
          <Link
            href="/learn"
            className="font-sans text-xs tracking-widest uppercase border border-sage/40 text-sage px-8 py-3.5 hover:border-mist hover:text-mist transition-all duration-300"
          >
            {t.hero.cta2}
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <motion.div
          className="w-px h-12 origin-top bg-sage"
          variants={lineReveal}
          initial={initial}
          animate={animate}
        />
      </div>
    </section>
  );
}
