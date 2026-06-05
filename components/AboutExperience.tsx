"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function AboutExperience() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F4F1E8]">
      <section className="relative overflow-hidden bg-deep px-6 pb-20 pt-32 md:pb-24">
        <div className="absolute inset-0 editorial-grain opacity-30" />
        <div className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-forest/20 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-[1fr_0.82fr] md:items-end">
          <div>
            <p className="mb-6 font-sans text-xs uppercase tracking-[0.3em] text-mist">{t.about.eyebrow}</p>
            <h1 className="font-serif text-6xl md:text-8xl text-cream leading-tight whitespace-pre-line">
              {t.about.title}
            </h1>
          </div>
          <div>
            <p className="mb-8 font-sans text-base leading-relaxed text-sage/80">{t.about.body}</p>
            <div className="rounded-[28px] border border-mist/20 bg-forest/30 p-6">
              <span className="block font-serif text-7xl leading-none text-mist">{t.about.stat}</span>
              <p className="mt-2 max-w-xs font-sans text-xs uppercase tracking-widest text-[#E8E8E2]/75">{t.about.statLabel}</p>
            </div>
          </div>
        </div>
        </div>
      </section>

      <section className="editorial-section bg-[#F4F1E8] px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 grid grid-cols-1 gap-8 md:grid-cols-[0.78fr_1.22fr] md:items-end">
            <div>
              <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-gold">{t.about.pillarsTitle}</p>
              <h2 className="font-serif text-5xl leading-tight text-deep md:text-6xl">Education before everything.</h2>
            </div>
            <p className="max-w-xl font-sans text-sm leading-relaxed text-[#5F6648] md:justify-self-end">
              UNVEIL is built as a calm learning space first: practical, discreet, and designed to help men understand themselves with more clarity.
            </p>
          </div>
          <div className="editorial-gap grid grid-cols-1 md:grid-cols-3">
            {t.mission.pillars.map((pillar, i) => (
              <div key={i} className="editorial-card flex min-h-[280px] flex-col bg-[#E8E8E2]">
                <span className="mb-8 block font-sans text-5xl font-semibold leading-none text-[#4D5039]">0{i + 1}</span>
                <h3 className="mb-4 font-sans text-2xl leading-tight text-[#202315]">{pillar.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-[#5F6648]">{pillar.desc}</p>
                <span className="mt-auto block pt-8">
                  <span className="block h-px w-12 bg-gold/45" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section bg-[#E8E8E2] px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 grid grid-cols-1 gap-8 md:grid-cols-[0.82fr_1.18fr] md:items-end">
            <div>
              <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-gold">{t.about.valuesTitle}</p>
              <h2 className="font-serif text-5xl leading-tight text-deep md:text-6xl">Built with restraint.</h2>
            </div>
            <p className="max-w-xl font-sans text-sm leading-relaxed text-[#5F6648] md:justify-self-end">
              The brand language stays mature, useful, and privacy-conscious, without turning education into spectacle.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-[clamp(1rem,2vw,1.5rem)] md:grid-cols-2">
            {t.about.values.map((value, index) => (
              <div key={value.title} className="rounded-[28px] border border-[rgba(77,80,57,0.18)] bg-[#F4F1E8] p-[clamp(1.5rem,3vw,2.5rem)]">
                <span className="mb-6 block font-sans text-xs uppercase tracking-[0.3em] text-gold">0{index + 1}</span>
                <h3 className="mb-3 font-sans text-2xl leading-tight text-[#202315]">{value.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-[#5F6648]">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-deep px-6 py-24 text-center">
        <p className="mx-auto max-w-3xl font-serif text-4xl italic leading-snug text-[#E8E8E2] md:text-6xl">
          "That's why this space exists."
        </p>
        <p className="mx-auto mt-6 max-w-xl font-sans text-sm leading-relaxed text-[#E8E8E2]/70">
          A discreet educational platform for modern men who want knowledge before products and clarity before pressure.
        </p>
      </section>
    </div>
  );
}
