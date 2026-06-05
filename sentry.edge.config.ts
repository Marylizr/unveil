import * as Sentry from "@sentry/nextjs";
import {
  getSentryEnvironment,
  getSentryRelease,
  getSentryTracesSampleRate,
  isProductionSentryEnabled,
} from "@/lib/sentryConfig";

const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: isProductionSentryEnabled(dsn),
  environment: getSentryEnvironment(),
  release: getSentryRelease(),
  tracesSampleRate: getSentryTracesSampleRate(),
  sendDefaultPii: false,
});
