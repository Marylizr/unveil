"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminListTools";
import { useAdminToken } from "@/components/admin/AdminAuthGate";
import LeadMagnetForm from "@/components/admin/LeadMagnetForm";
import { adminApi } from "@/lib/admin/adminApi";
import type { LeadMagnet } from "@/types/content";

export default function EditLeadMagnetPage({ params }: { params: { id: string } }) {
  const { token } = useAdminToken();
  const [leadMagnet, setLeadMagnet] = useState<LeadMagnet | null>(null);

  useEffect(() => {
    adminApi.leadMagnets.get(token, params.id).then(setLeadMagnet).catch(() => setLeadMagnet(null));
  }, [token, params.id]);

  return (
    <div>
      <AdminHeader eyebrow="Conversion" title={leadMagnet ? leadMagnet.title : "Loading lead magnet"} />
      {leadMagnet && <LeadMagnetForm leadMagnet={leadMagnet} />}
    </div>
  );
}

