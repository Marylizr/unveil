import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LeadMagnetCard from "@/components/marketing/LeadMagnetCard";
import { leadMagnetFallbackImage } from "@/lib/brandAssets";
import { getFallbackLeadMagnet } from "@/lib/fallbackContent";
import { connectToDatabase } from "@/lib/server/db";
import { withShareMetadata } from "@/lib/seo";
import { getLeadMagnetBySlug } from "@/server/services/leadMagnetService";
import type { LeadMagnet } from "@/types/content";

interface LeadMagnetPageProps {
  params: { slug: string };
}

async function loadLeadMagnet(slug: string) {
  try {
    await connectToDatabase();
    const leadMagnet = (await getLeadMagnetBySlug(slug)) as unknown as LeadMagnet | null;
    return leadMagnet || getFallbackLeadMagnet(slug) || null;
  } catch {
    return getFallbackLeadMagnet(slug) || null;
  }
}

export async function generateMetadata({ params }: LeadMagnetPageProps): Promise<Metadata> {
  const leadMagnet = await loadLeadMagnet(params.slug);

  if (!leadMagnet) {
    return withShareMetadata({
      title: "UNVEIL Guide",
      description: "A discreet educational UNVEIL resource.",
      imageAlt: "UNVEIL educational guide",
      path: `/lead-magnets/${params.slug}`,
    });
  }

  return withShareMetadata({
    title: `${leadMagnet.title} | UNVEIL`,
    description: leadMagnet.description,
    image: leadMagnet.coverImage?.url || leadMagnetFallbackImage(),
    imageAlt: leadMagnet.coverImage?.alt || leadMagnet.title,
    path: `/lead-magnets/${leadMagnet.slug}`,
  });
}

export default async function LeadMagnetPage({ params }: LeadMagnetPageProps) {
  const leadMagnet = await loadLeadMagnet(params.slug);
  if (!leadMagnet) notFound();

  return (
    <div className="bg-cream pt-24 text-deep">
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="mb-12 max-w-3xl">
          <p className="mb-5 font-sans text-xs uppercase tracking-[0.3em] text-olive/70">Free UNVEIL guide</p>
          <h1 className="font-serif text-5xl leading-tight md:text-7xl">{leadMagnet.title}</h1>
          <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-olive/85">
            {leadMagnet.description}
          </p>
        </div>
        <LeadMagnetCard leadMagnet={leadMagnet} source={`lead-magnet-${leadMagnet.slug}`} />
      </section>
    </div>
  );
}
