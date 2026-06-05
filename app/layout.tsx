import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import AppChrome from "@/components/AppChrome";
import { FALLBACK_OG_IMAGE, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "UNVEIL | Men's Intimate Health & Body Literacy",
    template: "%s | UNVEIL",
  },
  description:
    "Premium education for men's intimate health, hygiene, emotional intelligence, body literacy, and modern self-care.",
  keywords: [
    "men's intimate health",
    "male sexual health education",
    "men's hygiene",
    "body literacy",
    "modern masculine self-care",
  ],
  applicationName: "UNVEIL",
  authors: [{ name: "UNVEIL" }],
  creator: "UNVEIL",
  publisher: "UNVEIL",
  openGraph: {
    title: "UNVEIL | Men's Intimate Health & Body Literacy",
    description:
      "A calm, premium educational space for men's intimate health, body literacy, hygiene, and self-care.",
    url: SITE_URL,
    siteName: "UNVEIL",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: FALLBACK_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "UNVEIL editorial wellness platform",
      },
    ],
  },
  alternates: {
    canonical: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "UNVEIL | Men's Intimate Health & Body Literacy",
    description:
      "Premium education for men's intimate health, body literacy, hygiene, and self-care.",
    images: [FALLBACK_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <AppChrome>{children}</AppChrome>
        </LanguageProvider>
        <AnalyticsProvider />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: "UNVEIL",
                  url: "https://unveil.co",
                  description:
                    "Premium education for men's intimate health, body literacy, hygiene, emotional intelligence, and self-care.",
                },
                {
                  "@type": "WebSite",
                  name: "UNVEIL",
                  url: "https://unveil.co",
                  inLanguage: "en",
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
