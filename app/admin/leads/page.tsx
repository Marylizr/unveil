"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminEmptyState, AdminHeader, AdminTableCard, FilterSelect, PAGE_SIZE, Pagination, SearchBox } from "@/components/admin/AdminListTools";
import { useAdminToken } from "@/components/admin/AdminAuthGate";
import { adminApi } from "@/lib/admin/adminApi";
import type { Lead } from "@/types/admin";

function csvEscape(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function hasEvent(lead: Lead, key: "openedAt" | "clickedAt" | "completedAt") {
  return lead.emailSequenceEvents?.some((event) => Boolean(event[key]));
}

export default function AdminLeadsPage() {
  const { token } = useAdminToken();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [source, setSource] = useState("all");
  const [resource, setResource] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    adminApi.leads.list(token).then(setLeads).catch(() => {});
  }, [token]);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return leads.filter((lead) =>
      [lead.email, lead.firstName, lead.country, lead.source, lead.status, lead.interests?.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(needle) &&
      (status === "all" || (status === "unsubscribed" ? Boolean(lead.unsubscribedAt) : lead.status === status)) &&
      (source === "all" || lead.source === source) &&
      (resource === "all" || lead.requestedLeadMagnetSlug === resource)
    );
  }, [leads, query, status, source, resource]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function exportCsv() {
    const headers = [
      "email",
      "status",
      "firstName",
      "country",
      "interests",
      "source",
      "requestedLeadMagnetSlug",
      "language",
      "consentedAt",
      "emailConfirmedAt",
      "unsubscribedAt",
      "emailSequenceStep",
      "emailSequenceStatus",
      "opened",
      "clicked",
      "completed",
      "consentVersion",
      "privacyPolicyUrl",
      "createdAt",
    ];
    const rows = filtered.map((lead) => [
      lead.email,
      lead.status,
      lead.firstName,
      lead.country,
      lead.interests?.join("; "),
      lead.source,
      lead.requestedLeadMagnetSlug,
      lead.language,
      lead.consentedAt,
      lead.emailConfirmedAt,
      lead.unsubscribedAt,
      lead.emailSequenceStep,
      lead.welcomeSequenceStatus,
      hasEvent(lead, "openedAt"),
      hasEvent(lead, "clickedAt"),
      lead.welcomeSequenceStatus === "completed" || hasEvent(lead, "completedAt"),
      lead.consentVersion,
      lead.privacyPolicyUrl,
      lead.createdAt,
    ]);
    const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "unveil-leads.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <AdminHeader eyebrow="Audience" title="Leads" action={<button className="admin-primary" type="button" onClick={exportCsv}>Export CSV</button>} />
      <div className="admin-tools-card mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <SearchBox value={query} onChange={(value) => { setQuery(value); setPage(1); }} />
        <FilterSelect label="Status" value={status} onChange={(value) => { setStatus(value); setPage(1); }} options={[{ label: "All", value: "all" }, { label: "Pending", value: "pending" }, { label: "Confirmed", value: "confirmed" }, { label: "Unsubscribed", value: "unsubscribed" }]} />
        <FilterSelect label="Source" value={source} onChange={(value) => { setSource(value); setPage(1); }} options={[{ label: "All", value: "all" }, ...Array.from(new Set(leads.map((item) => item.source).filter(Boolean))).map((value) => ({ label: value, value }))]} />
        <FilterSelect label="Resource" value={resource} onChange={(value) => { setResource(value); setPage(1); }} options={[{ label: "All", value: "all" }, ...Array.from(new Set(leads.map((item) => item.requestedLeadMagnetSlug).filter(Boolean) as string[])).map((value) => ({ label: value, value }))]} />
      </div>
      <AdminTableCard
        count={filtered.length}
        empty={
          <AdminEmptyState
            title="No leads found"
            body="Adjust the search or filters. New leads will appear here after form submissions."
          />
        }
        minWidth={1360}
      >
        <table className="admin-table">
          <thead>
            <tr><th>Email</th><th>Status</th><th>Source</th><th>Resource</th><th>Sequence</th><th>Opened</th><th>Clicked</th><th>Completed</th><th>Created</th><th>Confirmed</th><th>Consent</th></tr>
          </thead>
          <tbody>
            {visible.map((lead) => (
              <tr key={lead._id}>
                <td>
                  <span className="admin-row-title">{lead.email}</span>
                  <span className="admin-row-meta">{lead.firstName || lead.country || "No profile details"}</span>
                </td>
                <td>
                  <span className="rounded-full border border-olive/20 px-2 py-1 text-xs uppercase tracking-widest text-olive">
                    {lead.unsubscribedAt ? "unsubscribed" : lead.status}
                  </span>
                </td>
                <td>{lead.source}</td>
                <td>{lead.requestedLeadMagnetSlug || "—"}</td>
                <td>{lead.emailSequenceStep || 0}/5 · {lead.welcomeSequenceStatus || "not_started"}</td>
                <td>{hasEvent(lead, "openedAt") ? "Yes" : "No"}</td>
                <td>{hasEvent(lead, "clickedAt") ? "Yes" : "No"}</td>
                <td>{lead.welcomeSequenceStatus === "completed" || hasEvent(lead, "completedAt") ? "Yes" : "No"}</td>
                <td>{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "—"}</td>
                <td>{lead.emailConfirmedAt ? new Date(lead.emailConfirmedAt).toLocaleDateString() : "—"}</td>
                <td>{lead.consentedAt ? new Date(lead.consentedAt).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableCard>
      <Pagination page={page} pageCount={pageCount} total={filtered.length} onPageChange={setPage} />
    </div>
  );
}
