"use client";

import { motion, useReducedMotion } from "framer-motion";

const topics = [
  {
    title: "Hygiene literacy",
    body: "Clear routines, product context, and care principles for daily confidence.",
  },
  {
    title: "Body awareness",
    body: "Plain-language education about anatomy, comfort, recovery, and signals worth noticing.",
  },
  {
    title: "Emotional intelligence",
    body: "Tools for regulation, self-awareness, communication, and grounded presence.",
  },
  {
    title: "Responsible intimacy education",
    body: "Mature, non-explicit guidance for trust, communication, consent, and wellbeing.",
  },
];

export default function WhatUnveilTeaches() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="editorial-section bg-[#444f26] px-6 text-[#efe9df]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 grid grid-cols-1 gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-[#90844a]">What UNVEIL teaches</p>
            <h2 className="font-serif text-5xl leading-tight text-[#efe9df] md:text-6xl">
            A modern curriculum for men’s self-care.
            </h2>
          </div>
          <p className="max-w-xl font-sans text-sm leading-relaxed text-[#efe9df]/72 md:justify-self-end">
            A calm sequence of literacy, routine, self-awareness, and responsible intimacy education.
          </p>
        </div>
        <div className="editorial-gap grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map((topic, index) => (
            <motion.article
              key={topic.title}
              data-unveil-card
              initial={shouldReduceMotion ? false : { opacity: 1, y: 18, scale: 0.992 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              whileHover={shouldReduceMotion ? undefined : { y: -4 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.72, delay: shouldReduceMotion ? 0 : index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group flex min-h-[280px] flex-col rounded-3xl border border-[#efe9df]/15 bg-[#efe9df]/8 p-[clamp(1.5rem,3vw,2.5rem)] text-[#efe9df] shadow-[0_24px_80px_rgba(0,0,0,0.22)] transition-colors duration-300 hover:border-[#90844a]/55"
            >
              <span className="mb-8 block font-sans text-5xl font-semibold leading-none text-[#efe9df]/70 transition-transform duration-500 group-hover:-translate-y-1">
                0{index + 1}
              </span>
              <h3 className="mb-3 font-sans text-2xl leading-tight text-[#efe9df]">{topic.title}</h3>
              <p className="font-sans text-sm leading-relaxed text-[#efe9df]/72">{topic.body}</p>
              <span className="mt-auto block pt-8">
                <span className="block h-px w-10 bg-[#90844a]/55 transition-all duration-500 group-hover:w-20 group-hover:bg-[#90844a]" />
              </span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
