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
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#232618_0%,#444f26_55%,#90844a_130%)] px-6 pb-16 pt-24 text-[#efe9df]">
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
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#efe9df]/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Eyebrow */}
        <motion.p
          className="mb-8 font-sans text-xs uppercase tracking-[0.3em] text-[#efe9df]/72"
          variants={fadeUp}
          initial={initial}
          animate={animate}
        >
          {t.hero.eyebrow}
        </motion.p>

        {/* Main headline */}
        <motion.h1
          className="mb-10 font-serif text-6xl leading-[0.95] text-[#efe9df] md:text-8xl lg:text-9xl"
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
          className="mx-auto mb-12 max-w-xl font-sans text-base leading-relaxed text-[#efe9df]/76 md:text-lg"
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
            className="bg-[#efe9df] px-8 py-3.5 font-sans text-xs uppercase tracking-widest text-[#232618] transition-colors duration-300 hover:bg-[#f8f3ea]"
          >
            {t.hero.cta1}
          </Link>
          <Link
            href="/learn"
            className="border border-[#efe9df]/35 px-8 py-3.5 font-sans text-xs uppercase tracking-widest text-[#efe9df] transition-all duration-300 hover:bg-[#efe9df]/10"
          >
            {t.hero.cta2}
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <motion.div
          className="h-12 w-px origin-top bg-[#efe9df]/55"
          variants={lineReveal}
          initial={initial}
          animate={animate}
        />
      </div>
    </section>
  );
}
