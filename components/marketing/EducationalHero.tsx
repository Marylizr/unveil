import Link from "next/link";

export default function EducationalHero() {
  return (
    <section className="soft-paper editorial-section bg-cream px-6 text-deep">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-5 font-sans text-xs uppercase tracking-[0.3em] text-gold">Education before products</p>
          <h2 className="font-serif text-5xl leading-tight text-deep md:text-7xl">
            A quieter way to understand male self-care.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl font-sans text-base leading-relaxed text-[#5F6648]">
            UNVEIL teaches men how hygiene, body literacy, emotional regulation, communication, and self-care work together before anything is sold or recommended.
          </p>
        </div>

        <div className="editorial-gap mt-14 grid grid-cols-1 md:grid-cols-3">
          {[
            ["01", "Educational first", "Body literacy and context before product pressure."],
            ["02", "Discreet wellness", "Refined language for sensitive topics without shame."],
            ["03", "Responsible guidance", "Clear boundaries, medical caution, and mature positioning."],
          ].map(([number, title, body]) => (
            <article key={title} className="editorial-card bg-soft-cream/80">
              <div className="flex items-start justify-between gap-6">
                <span className="font-sans text-4xl font-semibold leading-none text-[#4D5039]">{number}</span>
                <span className="mt-2 h-px flex-1 bg-gold/35" />
              </div>
              <h3 className="mt-8 font-sans text-2xl leading-tight text-deep">{title}</h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-[#5F6648]">{body}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/learn" className="inline-flex rounded-full border border-olive/30 px-7 py-3 font-sans text-xs uppercase tracking-widest text-olive transition-colors hover:border-gold hover:text-deep">
            Read the journal
          </Link>
        </div>
      </div>
    </section>
  );
}
