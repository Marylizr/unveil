"use client";

import { useEffect, useState } from "react";
import { getLeadMagnets } from "@/lib/api";
import type { LeadMagnet } from "@/types/content";
import LeadMagnetCard from "./LeadMagnetCard";

export default function LeadMagnetSection({ source = "homepage-lead-magnet" }: { source?: string }) {
  const [leadMagnets, setLeadMagnets] = useState<LeadMagnet[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    getLeadMagnets()
      .then((data) => {
        setLeadMagnets(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "error" || (status === "ready" && leadMagnets.length === 0)) return null;

  return (
    <section className="editorial-section soft-paper bg-[#E8E8E2] px-6">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-gold">Free education</p>
          <h2 className="font-serif text-5xl leading-tight text-deep md:text-6xl">Start with body literacy</h2>
          <p className="mt-5 font-sans text-base leading-relaxed text-[#5F6648]">
            Practical, discreet resources for men who want to understand their bodies before buying anything.
          </p>
        </div>
        {status === "loading" ? (
          <div className="border border-olive/20 bg-parchment p-10 font-sans text-sm text-olive">Preparing the guide library.</div>
        ) : (
          <div className="space-y-6">
            {leadMagnets.slice(0, 2).map((leadMagnet) => (
              <LeadMagnetCard key={leadMagnet._id} leadMagnet={leadMagnet} source={source} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
