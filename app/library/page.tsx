import AccountShell, { EmptyState } from "@/components/account/AccountShell";
import { requireUser } from "@/lib/auth/userAuth";

export const dynamic = "force-dynamic";

const shelves = ["Ebooks", "PDFs", "Guides", "Future courses"];

export default async function LibraryPage() {
  await requireUser();

  return (
    <AccountShell eyebrow="Learning library" title="Library">
      <div className="grid grid-cols-1 gap-[clamp(1rem,2vw,1.5rem)] md:grid-cols-4">
        {shelves.map((shelf) => (
          <section key={shelf} className="rounded-[28px] border border-[rgba(77,80,57,0.18)] bg-[#F4F1E8] p-8">
            <p className="mb-8 font-sans text-xs uppercase tracking-[0.3em] text-gold">{shelf}</p>
            <h2 className="font-sans text-2xl text-[#202315]">No items yet</h2>
            <p className="mt-3 font-sans text-sm leading-relaxed text-[#5F6648]">
              This shelf is prepared for future protected content.
            </p>
          </section>
        ))}
      </div>
      <div className="mt-6">
        <EmptyState
          title="Protected education will live here."
          body="The library architecture is ready for ebooks, downloadable PDFs, premium guides, and later course modules, without activating payment access yet."
        />
      </div>
    </AccountShell>
  );
}
