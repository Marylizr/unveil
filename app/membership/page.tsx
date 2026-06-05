import AccountShell, { EmptyState } from "@/components/account/AccountShell";
import { requireUser } from "@/lib/auth/userAuth";

export const dynamic = "force-dynamic";

export default async function MembershipPage() {
  const user = await requireUser();

  return (
    <AccountShell eyebrow="Membership" title="Membership">
      <div className="grid grid-cols-1 gap-[clamp(1rem,2vw,1.5rem)] md:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-[28px] border border-[rgba(77,80,57,0.18)] bg-[#F4F1E8] p-8">
          <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-gold">Current role</p>
          <h2 className="font-sans text-3xl capitalize text-[#202315]">{user.role}</h2>
          <p className="mt-4 font-sans text-sm leading-relaxed text-[#5F6648]">
            Membership tiers are modeled as guest, member, premium, and admin. Paid access is not active yet.
          </p>
        </section>
        <EmptyState
          title="Premium membership is not active yet."
          body="This page is prepared for future membership benefits and protected education. No subscription, billing, or checkout logic has been added."
        />
      </div>
    </AccountShell>
  );
}
