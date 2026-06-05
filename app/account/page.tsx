import AccountShell, { EmptyState } from "@/components/account/AccountShell";
import { requireUser } from "@/lib/auth/userAuth";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <AccountShell eyebrow="Private account" title="Account">
      <div className="grid grid-cols-1 gap-[clamp(1rem,2vw,1.5rem)] md:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-[28px] border border-[rgba(77,80,57,0.18)] bg-[#F4F1E8] p-8">
          <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-gold">Profile</p>
          <dl className="space-y-4 font-sans text-sm text-[#5F6648]">
            <div>
              <dt className="text-xs uppercase tracking-widest text-olive/70">Email</dt>
              <dd className="mt-1 text-[#202315]">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-olive/70">Role</dt>
              <dd className="mt-1 text-[#202315]">{user.role}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-olive/70">Email status</dt>
              <dd className="mt-1 text-[#202315]">{user.isEmailVerified ? "Verified" : "Pending verification"}</dd>
            </div>
          </dl>
        </section>
        <EmptyState
          title="Your UNVEIL account is ready for future access."
          body="Purchases, protected resources, courses, and membership benefits will appear here once monetization is activated. Leads remain separate from user accounts."
        />
      </div>
    </AccountShell>
  );
}
