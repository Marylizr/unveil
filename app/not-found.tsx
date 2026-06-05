import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-deep px-6 pt-32 text-cream">
      <section className="mx-auto max-w-2xl border border-forest/50 bg-forest/20 p-8">
        <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-mist/70">404</p>
        <h1 className="font-serif text-5xl leading-tight">This page is not available.</h1>
        <p className="mt-5 font-sans text-sm leading-relaxed text-sage/75">
          The resource may be unpublished, moved, or still being prepared.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex bg-mist px-6 py-3 font-sans text-xs uppercase tracking-widest text-deep"
        >
          Return home
        </Link>
      </section>
    </div>
  );
}

