import type { Metadata } from "next";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { connectToDatabase } from "@/lib/server/db";
import { listPublishedLeadMagnetsForLinks } from "@/server/services/leadMagnetService";
import type { LeadMagnet } from "@/types/content";

export const metadata: Metadata = {
  title: "UNVEIL Guides",
  description: "Discreet educational guides from UNVEIL on hygiene, confidence, intimacy, and modern self-care.",
  openGraph: {
    title: "UNVEIL Guides",
    description: "Discreet educational guides from UNVEIL on hygiene, confidence, intimacy, and modern self-care.",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

async function loadLeadMagnets(): Promise<LeadMagnet[]> {
  try {
    await connectToDatabase();
    return (await listPublishedLeadMagnetsForLinks()) as unknown as LeadMagnet[];
  } catch {
    return [];
  }
}

function getLeadMagnetImageAlt(leadMagnet: LeadMagnet) {
  return leadMagnet.coverImage?.alt?.trim() || `${leadMagnet.title} guide cover`;
}

export default async function LinksPage() {
  const leadMagnets = await loadLeadMagnets();

  return (
    <main className="min-h-screen bg-[#F4F1E8] px-4 py-7 text-deep sm:px-6 sm:py-10">
      <section className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-[560px] flex-col">
        <header className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <BrandLogo variant="dark" context="footer" />
          </div>
          <h1 className="font-serif text-4xl leading-tight text-deep sm:text-5xl">UNVEIL Guides</h1>
          <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-[#4D5C2A] sm:text-[15px]">
            Discreet educational resources for male hygiene, confidence, intimacy, and modern self-care.
          </p>
        </header>

        {leadMagnets.length > 0 ? (
          <div className="grid gap-3" aria-label="Published UNVEIL guides">
            {leadMagnets.map((leadMagnet) => (
              <Link
                key={leadMagnet._id || leadMagnet.slug}
                href={`/lead-magnets/${leadMagnet.slug}`}
                className="group grid min-h-[128px] grid-cols-[86px_1fr] gap-4 rounded-lg border border-[#D8CFBE] bg-[#FAFAF7] p-3 text-deep shadow-[0_14px_34px_rgba(26,32,16,0.08)] transition duration-200 hover:-translate-y-0.5 hover:border-[#B28E5E] focus-visible:-translate-y-0.5 sm:grid-cols-[104px_1fr] sm:p-4"
                aria-label={`Get the guide: ${leadMagnet.title}`}
                data-track={`links-lead-magnet-${leadMagnet.slug}`}
              >
                <span className="block h-full min-h-[104px] overflow-hidden rounded-md border border-[#E8E3D8] bg-[#E8E3D8]">
                  {leadMagnet.coverImage?.url ? (
                    <img
                      src={leadMagnet.coverImage.url}
                      alt={getLeadMagnetImageAlt(leadMagnet)}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <span className="flex h-full min-h-[104px] items-center justify-center bg-deep px-3 text-center font-sans text-[10px] uppercase tracking-[0.2em] text-gold">
                      UNVEIL
                    </span>
                  )}
                </span>

                <span className="flex min-w-0 flex-col py-1">
                  {leadMagnet.category ? (
                    <span className="mb-2 font-sans text-[10px] uppercase tracking-[0.2em] text-[#6E744F]">
                      {leadMagnet.category}
                    </span>
                  ) : null}
                  <span className="font-sans text-[15px] font-semibold leading-snug text-deep sm:text-base">
                    {leadMagnet.title}
                  </span>
                  {leadMagnet.description ? (
                    <span className="mt-2 font-sans text-xs leading-relaxed text-[#5F6648] sm:text-[13px]">
                      {leadMagnet.description}
                    </span>
                  ) : null}
                  <span className="mt-4 inline-flex min-h-[42px] w-full items-center justify-center rounded-md bg-deep px-4 text-center font-sans text-[11px] uppercase tracking-[0.18em] text-[#F4F1E8] transition-colors group-hover:bg-olive">
                    Get the guide
                  </span>
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-[#D8CFBE] bg-[#FAFAF7] p-6 text-center shadow-[0_14px_34px_rgba(26,32,16,0.08)]">
            <p className="font-serif text-3xl leading-tight text-deep">New guides are coming soon.</p>
            <Link
              href="/"
              className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-md bg-deep px-5 text-center font-sans text-xs uppercase tracking-[0.18em] text-[#F4F1E8] transition-colors hover:bg-olive"
            >
              Return home
            </Link>
          </div>
        )}

        <footer className="mt-auto pt-10 text-center">
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-sans text-xs text-[#4D5C2A]" aria-label="Footer links">
            <Link className="underline-offset-4 hover:underline" href="/">Home</Link>
            <Link className="underline-offset-4 hover:underline" href="/privacy">Privacy</Link>
            <Link className="underline-offset-4 hover:underline" href="/unsubscribe">Unsubscribe</Link>
          </nav>
          <p className="mt-5 font-sans text-[11px] uppercase tracking-[0.24em] text-[#8A7049]">@unveil</p>
        </footer>
      </section>
    </main>
  );
}
