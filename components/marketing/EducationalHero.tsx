import Link from "next/link";

export default function EducationalHero() {
  return (
    <section className="soft-paper editorial-section bg-[#efe9df] px-6 text-[#444f26]">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-5 font-sans text-xs uppercase tracking-[0.3em] text-[#90844a]">Education before products</p>
          <h2 className="font-serif text-5xl leading-tight text-[#444f26] md:text-7xl">
            A quieter way to understand male self-care.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl font-sans text-base leading-relaxed text-[#444f26]/75">
            UNVEIL teaches men how hygiene, body literacy, emotional regulation, communication, and self-care work together before anything is sold or recommended.
          </p>
        </div>

        <div className="editorial-gap mt-14 grid grid-cols-1 md:grid-cols-3">
          {[
            ["01", "Educational first", "Body literacy and context before product pressure."],
            ["02", "Discreet wellness", "Refined language for sensitive topics without shame."],
            ["03", "Responsible guidance", "Clear boundaries, medical caution, and mature positioning."],
          ].map(([number, title, body]) => (
            <article key={title} className="rounded-3xl border border-[#90844a]/20 bg-[#f8f3ea] p-[clamp(1.5rem,3vw,2.5rem)] text-[#444f26] shadow-[0_20px_60px_rgba(35,38,24,0.10)]">
              <div className="flex items-start justify-between gap-6">
                <span className="font-sans text-4xl font-semibold leading-none text-[#444f26]">{number}</span>
                <span className="mt-2 h-px flex-1 bg-[#90844a]/35" />
              </div>
              <h3 className="mt-8 font-sans text-2xl leading-tight text-[#444f26]">{title}</h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-[#444f26]/72">{body}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/learn" className="inline-flex rounded-full border border-[#90844a]/45 px-7 py-3 font-sans text-xs uppercase tracking-widest text-[#444f26] transition-colors hover:bg-[#90844a] hover:text-[#efe9df]">
            Read the journal
          </Link>
        </div>
      </div>
    </section>
  );
}
