export function isProductionSentryEnabled(dsn?: string) {
  return process.env.NODE_ENV === "production" && Boolean(dsn);
}

export function getSentryEnvironment() {
  return process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || "development";
}

export function getSentryRelease() {
  return process.env.SENTRY_RELEASE;
}

export function getSentryTracesSampleRate() {
  const value = Number(process.env.SENTRY_TRACES_SAMPLE_RATE);
  return Number.isFinite(value) ? value : 0.05;
}
