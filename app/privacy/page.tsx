import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How UNVEIL handles newsletter, lead, and site data with discretion and privacy-conscious defaults.",
  openGraph: {
    title: "UNVEIL Privacy Policy",
    description: "A clear overview of UNVEIL's privacy-conscious approach to educational wellness content and lead capture.",
  },
};

const sections = [
  {
    title: "What we collect",
    body: "UNVEIL currently collects only the information you choose to share, such as your email address, first name, country, interests, preferred language, and the form or resource that led you to subscribe.",
  },
  {
    title: "How we use it",
    body: "We use this information to send educational updates, deliver lead magnets, understand which topics are useful, and improve the quality of UNVEIL content. We do not ask for sensitive health details through public forms.",
  },
  {
    title: "Consent and unsubscribing",
    body: "Email forms include an active consent checkbox and use double opt-in confirmation before a lead becomes confirmed. UNVEIL stores consent text, consent version, source, timestamp, and basic technical context for compliance records. Every marketing email should include an unsubscribe link.",
  },
  {
    title: "Cookies and analytics",
    body: "UNVEIL uses optional analytics only after consent. Analytics helps us understand page views, content performance, and lead conversion paths without asking for sensitive health details.",
  },
  {
    title: "Email delivery providers",
    body: "UNVEIL may use a trusted email provider, such as Resend, to send confirmation emails, welcome emails, lead magnet access links, and educational updates. Email delivery data is used only to provide and maintain these communications.",
  },
  {
    title: "Your rights",
    body: "Depending on your location, you may request access, correction, deletion, or restriction of personal data, and you may withdraw marketing consent at any time through unsubscribe links or by contacting UNVEIL.",
  },
  {
    title: "Discretion",
    body: "UNVEIL is designed around privacy, calm language, and discreet education. We treat intimate wellness topics with care and avoid collecting information that is not needed for the experience.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream pt-24 text-deep">
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <p className="mb-5 font-sans text-xs uppercase tracking-[0.3em] text-olive/70">Legal</p>
        <h1 className="mb-8 font-serif text-5xl leading-tight md:text-7xl">Privacy Policy</h1>
        <p className="mb-12 font-sans text-base leading-relaxed text-olive">
          This policy describes UNVEIL’s current privacy posture before checkout is enabled. It should be reviewed by legal counsel before launch in each operating market.
        </p>
        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="border-t border-olive/20 pt-6">
              <h2 className="font-serif text-3xl leading-tight">{section.title}</h2>
              <p className="mt-3 font-sans text-sm leading-relaxed text-olive">{section.body}</p>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
