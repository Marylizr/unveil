const badges = [
  {
    title: "Education-first",
    body: "UNVEIL begins with literacy, context, and responsible guidance before any product recommendation.",
  },
  {
    title: "Discreet wellness",
    body: "Calm language, refined visuals, and private-feeling experiences for sensitive self-care topics.",
  },
  {
    title: "Evidence-informed",
    body: "Content is framed with care, avoids exaggerated claims, and encourages professional support when needed.",
  },
  {
    title: "Privacy-conscious",
    body: "Lead forms ask for only what is useful and include active consent before email communication.",
  },
  {
    title: "Responsible use",
    body: "UNVEIL positions adult wellness education with maturity, restraint, and clear boundaries.",
  },
];

export default function TrustBadges() {
  return (
    <section className="soft-paper bg-[#efe9df] px-6 py-20 text-[#444f26]">
      <div className="mx-auto mb-12 grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end">
        <div>
          <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-[#90844a]">Trust standards</p>
          <h2 className="font-serif text-5xl leading-tight text-[#444f26] md:text-6xl">Built with restraint</h2>
        </div>
        <p className="max-w-xl font-sans text-sm leading-relaxed text-[#444f26]/72">
          Trust is designed into the experience: careful language, privacy-aware forms, mature education, and a visual system that feels discreet rather than clinical.
        </p>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-[1em] md:grid-cols-5">
        {badges.map((badge, index) => (
          <div
            key={badge.title}
            className={`rounded-3xl border p-8 shadow-[0_20px_60px_rgba(35,38,24,0.10)] ${
              index === 0 || index === 3 ? "border-[#90844a]/20 bg-[#f8f3ea]" : index === 2 ? "border-[#90844a]/25 bg-[#90844a]/12" : "border-[#90844a]/20 bg-[#f8f3ea]"
            }`}
          >
            <span className="mb-8 block h-px w-12 bg-[#90844a]/55" />
            <h3 className="mb-3 font-sans text-xl text-[#444f26]">{badge.title}</h3>
            <p className="font-sans text-sm leading-relaxed text-[#444f26]/70">{badge.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
