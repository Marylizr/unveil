"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CONSENT_KEY = "unveil_analytics_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(window.localStorage.getItem(CONSENT_KEY) === null);
  }, []);

  function choose(value: "accepted" | "declined") {
    window.localStorage.setItem(CONSENT_KEY, value);
    window.dispatchEvent(new Event("unveil:analytics-consent"));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside className="fixed bottom-4 left-4 right-4 z-[60] border border-mist/20 bg-deep/95 p-5 text-cream backdrop-blur md:left-auto md:max-w-md">
      <p className="font-serif text-2xl leading-tight">Privacy-conscious analytics</p>
      <p className="mt-3 font-sans text-xs leading-relaxed text-sage">
        UNVEIL uses optional analytics to understand content performance and improve the educational experience. No sensitive health details are required.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => choose("accepted")}
          className="bg-mist px-5 py-3 font-sans text-xs uppercase tracking-widest text-deep"
        >
          Accept analytics
        </button>
        <button
          type="button"
          onClick={() => choose("declined")}
          className="border border-sage/40 px-5 py-3 font-sans text-xs uppercase tracking-widest text-sage"
        >
          Decline
        </button>
      </div>
      <Link href="/privacy" className="mt-4 inline-flex font-sans text-[11px] uppercase tracking-widest text-sage underline underline-offset-4">
        Privacy policy
      </Link>
    </aside>
  );
}

