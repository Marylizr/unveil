"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-deep px-6 pt-32 text-cream">
      <section className="mx-auto max-w-2xl border border-forest/50 bg-forest/20 p-8">
        <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-mist/70">UNVEIL</p>
        <h1 className="font-serif text-5xl leading-tight">Something needs a reset.</h1>
        <p className="mt-5 font-sans text-sm leading-relaxed text-sage/75">
          The page could not be prepared. Please try again, or return to the previous section.
        </p>
        {process.env.NODE_ENV === "development" && (
          <p className="mt-5 break-words font-sans text-xs leading-relaxed text-sage/50">
            {error.message}
          </p>
        )}
        <button
          type="button"
          onClick={reset}
          className="mt-8 bg-mist px-6 py-3 font-sans text-xs uppercase tracking-widest text-deep"
        >
          Try again
        </button>
      </section>
    </div>
  );
}

