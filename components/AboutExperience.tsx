"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function AboutExperience() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#efe9df]">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#232618_0%,#444f26_55%,#90844a_130%)] px-6 pb-20 pt-32 text-[#efe9df] md:pb-24">
        <div className="absolute inset-0 editorial-grain opacity-30" />
        <div className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#efe9df]/10 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-[1fr_0.82fr] md:items-end">
          <div>
            <p className="mb-6 font-sans text-xs uppercase tracking-[0.3em] text-[#efe9df]/72">{t.about.eyebrow}</p>
            <h1 className="whitespace-pre-line font-serif text-6xl leading-tight text-[#efe9df] md:text-8xl">
              {t.about.title}
            </h1>
          </div>
          <div>
            <p className="mb-8 font-sans text-base leading-relaxed text-[#efe9df]/76">{t.about.body}</p>
            <div className="rounded-3xl border border-[#efe9df]/15 bg-[#efe9df]/8 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
              <span className="block font-serif text-7xl leading-none text-[#efe9df]">{t.about.stat}</span>
              <p className="mt-2 max-w-xs font-sans text-xs uppercase tracking-widest text-[#efe9df]/72">{t.about.statLabel}</p>
            </div>
          </div>
        </div>
        </div>
      </section>

      <section className="editorial-section bg-[#efe9df] px-6 text-[#444f26]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 grid grid-cols-1 gap-8 md:grid-cols-[0.78fr_1.22fr] md:items-end">
            <div>
              <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-[#90844a]">{t.about.pillarsTitle}</p>
              <h2 className="font-serif text-5xl leading-tight text-[#444f26] md:text-6xl">Education before everything.</h2>
            </div>
            <p className="max-w-xl font-sans text-sm leading-relaxed text-[#444f26]/72 md:justify-self-end">
              UNVEIL is built as a calm learning space first: practical, discreet, and designed to help men understand themselves with more clarity.
            </p>
          </div>
          <div className="editorial-gap grid grid-cols-1 md:grid-cols-3">
            {t.mission.pillars.map((pillar, i) => (
              <div key={i} className="flex min-h-[280px] flex-col rounded-3xl border border-[#90844a]/20 bg-[#f8f3ea] p-[clamp(1.5rem,3vw,2.5rem)] text-[#444f26] shadow-[0_20px_60px_rgba(35,38,24,0.10)]">
                <span className="mb-8 block font-sans text-5xl font-semibold leading-none text-[#444f26]">0{i + 1}</span>
                <h3 className="mb-4 font-sans text-2xl leading-tight text-[#444f26]">{pillar.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-[#444f26]/72">{pillar.desc}</p>
                <span className="mt-auto block pt-8">
                  <span className="block h-px w-12 bg-[#90844a]/45" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section bg-[#444f26] px-6 text-[#efe9df]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 grid grid-cols-1 gap-8 md:grid-cols-[0.82fr_1.18fr] md:items-end">
            <div>
              <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-[#90844a]">{t.about.valuesTitle}</p>
              <h2 className="font-serif text-5xl leading-tight text-[#efe9df] md:text-6xl">Built with restraint.</h2>
            </div>
            <p className="max-w-xl font-sans text-sm leading-relaxed text-[#efe9df]/72 md:justify-self-end">
              The brand language stays mature, useful, and privacy-conscious, without turning education into spectacle.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-[clamp(1rem,2vw,1.5rem)] md:grid-cols-2">
            {t.about.values.map((value, index) => (
              <div key={value.title} className="rounded-3xl border border-[#efe9df]/15 bg-[#efe9df]/8 p-[clamp(1.5rem,3vw,2.5rem)] text-[#efe9df] shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                <span className="mb-6 block font-sans text-xs uppercase tracking-[0.3em] text-[#90844a]">0{index + 1}</span>
                <h3 className="mb-3 font-sans text-2xl leading-tight text-[#efe9df]">{value.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-[#efe9df]/72">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(135deg,#232618_0%,#444f26_55%,#90844a_130%)] px-6 py-24 text-center text-[#efe9df]">
        <p className="mx-auto max-w-3xl font-serif text-4xl italic leading-snug text-[#efe9df] md:text-6xl">
          &quot;That&apos;s why this space exists.&quot;
        </p>
        <p className="mx-auto mt-6 max-w-xl font-sans text-sm leading-relaxed text-[#efe9df]/72">
          A discreet educational platform for modern men who want knowledge before products and clarity before pressure.
        </p>
      </section>
    </div>
  );
}
