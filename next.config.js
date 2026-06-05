const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {},
};

const shouldEnableSentryBuild =
  process.env.NODE_ENV === "production" &&
  Boolean(process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN);

module.exports = shouldEnableSentryBuild
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: true,
      widenClientFileUpload: true,
      hideSourceMaps: true,
      disableLogger: true,
    })
  : nextConfig;
