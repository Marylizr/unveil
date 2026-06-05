"use client";

export function AdminHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
        <p className="mb-3 font-sans text-xs uppercase tracking-[0.24em] text-gold">{eyebrow}</p>
        <h1 className="font-sans text-3xl font-semibold leading-tight text-deep md:text-4xl">{title}</h1>
      </div>
      {action}
    </div>
  );
}

export function SearchBox({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="admin-label">Search</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="admin-input"
        placeholder="Search by title, category, source, or email"
      />
    </label>
  );
}

export function Pagination({
  page,
  pageCount,
  total,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  total?: number;
  onPageChange: (page: number) => void;
}) {
  if (pageCount <= 1 && total === undefined) return null;

  return (
    <div className="mt-6 flex flex-col gap-3 border-t border-olive/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="admin-secondary disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>
      <p className="font-sans text-xs uppercase tracking-widest text-olive/70">
        {total !== undefined ? `${total} result${total === 1 ? "" : "s"} · ` : ""}Page {page} of {pageCount}
      </p>
      <button
        type="button"
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
        className="admin-secondary disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

export function StatusPill({ active, label }: { active: boolean; label: string }) {
  return (
    <span className={`rounded-full border px-2 py-1 font-sans text-[10px] uppercase tracking-widest ${active ? "border-gold/40 text-olive" : "border-olive/15 text-olive/50"}`}>
      {label}
    </span>
  );
}

export function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <label className="block">
      <span className="admin-label">{label}</span>
      <select className="admin-input" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AdminTableCard({
  children,
  count,
  empty,
  minWidth = 760,
}: {
  children: React.ReactNode;
  count: number;
  empty: React.ReactNode;
  minWidth?: number;
}) {
  return (
    <section className="admin-panel overflow-hidden">
      <div className="flex flex-col gap-2 border-b border-deep/10 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans text-xs font-semibold uppercase tracking-widest text-[#5F6648]">
          {count} result{count === 1 ? "" : "s"}
        </p>
        <p className="font-sans text-xs text-[#5F6648]">Use filters above to refine this view.</p>
      </div>
      {count > 0 ? (
        <div className="overflow-x-auto">
          <div style={{ minWidth }}>
            {children}
          </div>
        </div>
      ) : (
        <div className="px-6 py-16 text-center">{empty}</div>
      )}
    </section>
  );
}

export function AdminEmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-md">
      <h2 className="font-sans text-2xl font-semibold text-deep">{title}</h2>
      <p className="mt-3 font-sans text-sm leading-relaxed text-[#5F6648]">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export const PAGE_SIZE = 8;
