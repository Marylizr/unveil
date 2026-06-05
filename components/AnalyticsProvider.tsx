"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CLARITY_PROJECT_ID, GA4_MEASUREMENT_ID, trackPageView } from "@/lib/analytics";

const shouldLoadAnalytics = process.env.NODE_ENV === "production";
const CONSENT_KEY = "unveil_analytics_consent";

export default function AnalyticsProvider() {
  const pathname = usePathname();
  const [hasConsent, setHasConsent] = useState(false);
  const loadGA4 = shouldLoadAnalytics && hasConsent && Boolean(GA4_MEASUREMENT_ID);
  const loadClarity = shouldLoadAnalytics && hasConsent && Boolean(CLARITY_PROJECT_ID);

  useEffect(() => {
    const updateConsent = () => setHasConsent(window.localStorage.getItem(CONSENT_KEY) === "accepted");

    updateConsent();
    window.addEventListener("unveil:analytics-consent", updateConsent);

    return () => window.removeEventListener("unveil:analytics-consent", updateConsent);
  }, []);

  useEffect(() => {
    if (!shouldLoadAnalytics || !hasConsent) return;
    trackPageView(window.location.href);
  }, [hasConsent, pathname]);

  return (
    <>
      {loadGA4 && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA4_MEASUREMENT_ID}', { send_page_view: false });
            `}
          </Script>
        </>
      )}

      {loadClarity && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
          `}
        </Script>
      )}
    </>
  );
}
