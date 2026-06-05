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
    <section className="soft-paper bg-eucalyptus px-6 py-20">
      <div className="mx-auto mb-12 grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end">
        <div>
          <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-deep/60">Trust standards</p>
          <h2 className="font-serif text-5xl leading-tight text-deep md:text-6xl">Built with restraint</h2>
        </div>
        <p className="max-w-xl font-sans text-sm leading-relaxed text-deep/72">
          Trust is designed into the experience: careful language, privacy-aware forms, mature education, and a visual system that feels discreet rather than clinical.
        </p>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-[1em] md:grid-cols-5">
        {badges.map((badge, index) => (
          <div
            key={badge.title}
            className={`border border-deep/10 p-8 ${
              index === 0 || index === 3 ? "bg-cream" : index === 2 ? "bg-pale-gold/45" : "bg-eucalyptus/55"
            }`}
          >
            <span className="mb-8 block h-px w-12 bg-gold/55" />
            <h3 className="mb-3 font-sans text-xl text-deep">{badge.title}</h3>
            <p className="font-sans text-sm leading-relaxed text-deep/70">{badge.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
