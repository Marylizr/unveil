import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Responsible Use",
  description: "UNVEIL responsible use notice for adult educational wellness content and self-care resources.",
  openGraph: {
    title: "UNVEIL Responsible Use",
    description: "A calm notice on educational wellness content, adult audience positioning, and when to seek professional support.",
  },
};

const supportSignals = [
  "persistent pain or discomfort",
  "possible infections or unusual symptoms",
  "erectile dysfunction or ongoing performance concerns",
  "severe anxiety, depression, or emotional distress",
  "relationship violence, coercion, or personal safety concerns",
];

export default function ResponsibleUsePage() {
  return (
    <div className="min-h-screen bg-cream pt-24 text-deep">
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <p className="mb-5 font-sans text-xs uppercase tracking-[0.3em] text-olive/70">Responsible use</p>
        <h1 className="mb-8 font-serif text-5xl leading-tight md:text-7xl">Education with care</h1>
        <div className="space-y-8 font-sans text-sm leading-relaxed text-olive">
          <p>
            UNVEIL offers educational wellness content for a responsible 18+ audience. Our focus is body literacy, hygiene, emotional intelligence, communication, grooming, comfort, and modern self-care.
          </p>
          <p>
            UNVEIL does not provide medical diagnosis, treatment, or emergency support. Content on this site is not a replacement for care from a qualified health professional.
          </p>
          <section className="border-t border-olive/20 pt-6">
            <h2 className="font-serif text-3xl leading-tight text-deep">When to seek professional support</h2>
            <p className="mt-3">Please consider medical or professional support for concerns such as:</p>
            <ul className="mt-5 space-y-3">
              {supportSignals.map((signal) => (
                <li key={signal} className="border-l border-mist/70 pl-4">
                  {signal}
                </li>
              ))}
            </ul>
          </section>
          <p>
            Responsible self-care includes knowing when education is enough and when direct support is the wiser next step.
          </p>
        </div>
      </section>
    </div>
  );
}
