import type { Express } from "express";
import * as Sentry from "@sentry/node";
import {
  getSentryEnvironment,
  getSentryRelease,
  getSentryTracesSampleRate,
  isProductionSentryEnabled,
} from "../lib/sentryConfig";

const dsn = process.env.SENTRY_DSN;
export const sentryEnabled = isProductionSentryEnabled(dsn);

if (sentryEnabled) {
  Sentry.init({
    dsn,
    environment: getSentryEnvironment(),
    release: getSentryRelease(),
    tracesSampleRate: getSentryTracesSampleRate(),
    sendDefaultPii: false,
  });
}

export function setupSentryErrorHandler(app: Express) {
  if (!sentryEnabled) return;
  Sentry.setupExpressErrorHandler(app);
}

export async function captureServerException(error: unknown) {
  if (!sentryEnabled) return;
  Sentry.captureException(error);
  await Sentry.flush(2000);
}
