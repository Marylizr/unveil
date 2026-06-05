import Link from "next/link";

const links = [
  { href: "/account", label: "Account" },
  { href: "/library", label: "Library" },
  { href: "/purchases", label: "Purchases" },
  { href: "/membership", label: "Membership" },
];

export default function AccountShell({
  children,
  eyebrow,
  title,
}: {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="min-h-screen bg-[#F4F1E8] px-6 pt-32 text-deep">
      <div className="mx-auto max-w-7xl pb-20">
        <div className="mb-10 flex flex-col gap-6 border-b border-olive/15 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
            <h1 className="font-serif text-5xl leading-tight md:text-7xl">{title}</h1>
          </div>
          <nav className="flex flex-wrap gap-3">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-full border border-olive/25 px-4 py-2 font-sans text-xs uppercase tracking-widest text-olive hover:border-gold hover:text-deep">
                {link.label}
              </Link>
            ))}
            <form action="/auth/logout" method="post">
              <button className="rounded-full border border-olive/25 px-4 py-2 font-sans text-xs uppercase tracking-widest text-olive hover:border-gold hover:text-deep" type="submit">
                Sign out
              </button>
            </form>
          </nav>
        </div>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ title, body }: { body: string; title: string }) {
  return (
    <section className="rounded-[28px] border border-[rgba(77,80,57,0.18)] bg-[#E8E8E2] p-8 md:p-10">
      <p className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-gold">Prepared for future access</p>
      <h2 className="font-sans text-3xl leading-tight text-[#202315]">{title}</h2>
      <p className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-[#5F6648]">{body}</p>
    </section>
  );
}
