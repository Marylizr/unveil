"use client";

type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || "";
export const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "";

export function analyticsEnabled() {
  return process.env.NODE_ENV === "production" && typeof window !== "undefined";
}

export function trackPageView(url: string) {
  if (!analyticsEnabled()) return;

  if (GA4_MEASUREMENT_ID && window.gtag) {
    window.gtag("config", GA4_MEASUREMENT_ID, {
      page_path: window.location.pathname,
      page_location: url,
      page_title: document.title,
      send_page_view: true,
    });
  }

  if (window.clarity) {
    window.clarity("set", "page_path", window.location.pathname);
  }
}

export function trackEvent(name: string, payload: AnalyticsPayload = {}) {
  if (!analyticsEnabled()) return;

  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null)
  );

  if (window.gtag) {
    window.gtag("event", name, cleanPayload);
  }

  if (window.clarity) {
    window.clarity("event", name);
  }
}

export function trackLeadSubmission(payload: AnalyticsPayload) {
  trackEvent("lead_submission", payload);
}

export function trackNewsletterSignup(payload: AnalyticsPayload) {
  trackEvent("newsletter_signup", payload);
}

export function trackLeadMagnetDownload(payload: AnalyticsPayload) {
  trackEvent("lead_magnet_download", payload);
}

export function trackProductDetailView(payload: AnalyticsPayload) {
  trackEvent("product_detail_view", payload);
}

export function trackArticleView(payload: AnalyticsPayload) {
  trackEvent("article_view", payload);
}

