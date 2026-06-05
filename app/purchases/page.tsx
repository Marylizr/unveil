import AccountShell, { EmptyState } from "@/components/account/AccountShell";
import { requireUser } from "@/lib/auth/userAuth";

export const dynamic = "force-dynamic";

export default async function PurchasesPage() {
  await requireUser();

  return (
    <AccountShell eyebrow="Purchase history" title="Purchases">
      <EmptyState
        title="No purchases yet."
        body="Purchase records are structured for future digital guides, resources, and courses. Checkout and billing are intentionally not active in this phase."
      />
    </AccountShell>
  );
}
