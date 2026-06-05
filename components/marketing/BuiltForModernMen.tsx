export default function BuiltForModernMen() {
  return (
    <section className="soft-paper grid grid-cols-1 bg-stone md:grid-cols-2">
      <div className="px-8 py-20 md:px-12 lg:px-16">
        <p className="mb-5 font-sans text-xs uppercase tracking-[0.3em] text-deep/60">Built for modern men</p>
        <h2 className="font-serif text-5xl leading-tight text-deep md:text-6xl">Quiet confidence is learned.</h2>
        <div className="mt-10 overflow-hidden rounded-tl-[4rem] bg-cream p-3 image-frame">
          <img
            src="/editorial/locker-room-study.png"
            alt="Black and white editorial study of masculine self-care"
            className="aspect-[4/3] w-full rounded-tl-[3.3rem] object-cover grayscale"
          />
        </div>
      </div>
      <div className="editorial-grain bg-deep px-8 py-20 md:px-12 lg:px-16">
        <div className="mx-auto max-w-md space-y-8 font-sans text-sm leading-relaxed text-cream/76">
          <p>
            UNVEIL is for men who want discretion without avoidance, education without shame, and self-care without performance theater.
          </p>
          <p>
            The platform is intentionally calm: no exaggerated claims, no explicit marketplace language, and no pressure to buy before understanding what matters.
          </p>
          <div className="border-y border-mist/20 py-8">
            <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-mist">Positioning</p>
            <p className="mt-3 text-cream">Educational wellness first. Commerce second.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
