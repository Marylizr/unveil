import { AdminHeader } from "@/components/admin/AdminListTools";
import LeadMagnetForm from "@/components/admin/LeadMagnetForm";

export default function NewLeadMagnetPage() {
  return (
    <div>
      <AdminHeader eyebrow="Conversion" title="New lead magnet" />
      <LeadMagnetForm />
    </div>
  );
}

