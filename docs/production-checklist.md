# UNVEIL Production Checklist

UNVEIL is education-first. Do not enable Stripe, checkout, or adult-shop positioning before this checklist is complete.

## Environment Variables

- [ ] `MONGODB_URI` points to the production MongoDB database.
- [ ] `NEXT_PUBLIC_API_URL` points to the production API origin.
- [ ] `NEXT_PUBLIC_SITE_URL` points to the public website URL.
- [ ] `APP_URL` matches the public website URL for server-generated email links, or `NEXT_PUBLIC_SITE_URL` is set for the same purpose.
- [ ] `ADMIN_USERNAME` is set only in deployment secrets.
- [ ] `ADMIN_PASSWORD` is strong, unique, and set only in deployment secrets.
- [ ] `ADMIN_API_TOKEN` is long, random, and stored only in secure deployment secrets.
- [ ] `ADMIN_SESSION_SECRET` is long, random, and different from `ADMIN_API_TOKEN`.
- [ ] `LEAD_TOKEN_SECRET` is long, random, and different from local values.
- [ ] `RESEND_API_KEY` is configured.
- [ ] `RESEND_FROM_EMAIL` uses a verified sender, for example `UNVEIL <hello@yourdomain.com>`.
- [ ] Resend verified sender matches the production domain.
- [ ] Resend email delivery test confirms confirmation, welcome, and future paid delivery templates.
- [ ] `NEXT_PUBLIC_GA4_MEASUREMENT_ID` is set.
- [ ] `NEXT_PUBLIC_CLARITY_PROJECT_ID` is set.
- [ ] `EMAIL_SEQUENCE_INTERVAL_MINUTES` is set or the default 15 minute backend worker interval is acceptable.
- [ ] `API_PUBLIC_URL` or `NEXT_PUBLIC_API_URL` points to the public API origin so email open/click tracking links resolve.
- [ ] `SENTRY_DSN` is set for server-side Next.js and backend API monitoring.
- [ ] `NEXT_PUBLIC_SENTRY_DSN` is set for browser error monitoring.
- [ ] `SENTRY_ENVIRONMENT` is set, for example `production`.
- [ ] `SENTRY_RELEASE` is set by the deployment pipeline when possible.
- [ ] Optional Sentry source-map upload variables are configured only in deployment secrets:
  - [ ] `SENTRY_ORG`
  - [ ] `SENTRY_PROJECT`
  - [ ] `SENTRY_AUTH_TOKEN`
- [ ] Optional `SENTRY_TRACES_SAMPLE_RATE` is set to a conservative production value, for example `0.05`.
- [ ] `CORS_ORIGINS` includes only production/staging frontend origins.
- [ ] Future Stripe variables are reserved but not enabled until the Stripe phase:
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`
  - [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## Resend And Email

- [ ] Production sending domain is verified in Resend.
- [ ] SPF, DKIM, and DMARC records are configured.
- [ ] SPF includes the authorized Resend sending mechanism for the domain.
- [ ] DKIM is verified in Resend for the production sending domain.
- [ ] DMARC policy exists before paid launch, even if initially set to monitoring.
- [ ] Confirmation email sends successfully.
- [ ] Welcome email sends successfully.
- [ ] Welcome email includes protected download link when a lead magnet was requested.
- [ ] Automated email sequence sends Email 1 immediately after confirmation.
- [ ] Automated email sequence sends Emails 2-5 when due.
- [ ] Email sequence open/click/completed tracking appears in `/admin/leads`.
- [ ] `/api/leads/sequence/open/:token.gif` returns a tracking pixel.
- [ ] `/api/leads/sequence/click/:token` tracks the click and redirects safely.
- [ ] Unsubscribe link works.
- [ ] Email wording remains educational, discreet, and non-explicit.

## Lead Magnet PDFs

- [ ] `/downloads/unveil-body-awareness-guide.pdf` exists.
- [ ] `/downloads/unveil-7-hygiene-mistakes.pdf` exists.
- [ ] Seed lead magnet `pdfUrl` values match deployed files.
- [ ] Protected download page rejects invalid token.
- [ ] Protected download page rejects wrong slug/token combination.
- [ ] Only free lead magnets live in `public/downloads`.
- [ ] Paid ebooks/PDFs are not stored in `public/downloads` or any directly public path.
- [ ] Future paid files use private storage such as S3, Cloudflare R2, a private server route, or signed URLs.

## Pre-Stripe Product Readiness

- [ ] Product records for paid digital items include `productType: "digital"`.
- [ ] Product records include `price`, `currency`, `sku`, `isPublished`, and `isFeatured` where appropriate.
- [ ] Product records can store future Stripe fields:
  - [ ] `paymentProvider`
  - [ ] `checkoutMode`
  - [ ] `stripeProductId`
  - [ ] `stripePriceId`
- [ ] Product records can store private digital delivery fields:
  - [ ] `digitalAssetUrl`
  - [ ] `isProtectedAsset`
  - [ ] `downloadUrl` for legacy migration only.
- [ ] Public product API responses do not expose supplier costs, supplier IDs, Stripe IDs, or protected digital asset URLs.
- [ ] Paid digital product records use `isProtectedAsset: true`.
- [ ] Paid digital product records use `digitalAssetUrl` pointing to private storage, never `/downloads/...`.
- [ ] The Modern Man Code is stored as a private digital asset, not a public lead magnet PDF.
- [ ] Understanding Female Pleasure has a private asset path before checkout is enabled.
- [ ] The Art of Connection has a private asset path before checkout is enabled.
- [ ] Sales pages exist for `/modern-man-code`, `/understanding-female-pleasure`, and `/the-art-of-connection`.
- [ ] `/admin/orders` and `/admin/entitlements` are protected and visible only to admins.
- [ ] Entitlement download tokens are stored hashed only.
- [ ] Revoked or expired entitlements cannot download paid files.
- [ ] Future checkout phase creates Stripe Checkout Sessions server-side only.
- [ ] Future webhook phase verifies signatures with `STRIPE_WEBHOOK_SECRET`.
- [ ] Future paid fulfillment creates an Order and Entitlement only after verified payment success.
- [ ] Future paid entitlement creates a hashed download token before serving `/api/digital-assets/:productId`.
- [ ] `PRIVATE_DIGITAL_ASSETS_DIR` is configured for local/private server delivery if not using S3/R2.

## Cookie Consent And Analytics

- [ ] Cookie banner appears for new visitors.
- [ ] Declining analytics prevents GA4 and Clarity from loading.
- [ ] Accepting analytics loads GA4 and Clarity.
- [ ] GA4 page views are visible in realtime.
- [ ] Clarity receives sessions only after consent.
- [ ] Events are visible for:
  - [ ] `lead_submission`
  - [ ] `newsletter_signup`
  - [ ] `lead_magnet_download`
  - [ ] `product_detail_view`
  - [ ] `article_view`

## Legal And Privacy

- [ ] `/privacy` reflects double opt-in, analytics consent, unsubscribe, and lead storage.
- [ ] `/terms` is reviewed for pre-commerce launch.
- [ ] `/responsible-use` clearly states UNVEIL is educational wellness content, not medical advice.
- [ ] `/shipping-returns` remains pre-commerce appropriate until checkout exists.
- [ ] All forms link to the Privacy Policy.
- [ ] No public form asks for sensitive health information.

## Admin CMS

- [ ] `/admin` is not linked from public navigation.
- [ ] Admin login requires `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET`.
- [ ] Admin API writes require the server-side `ADMIN_API_TOKEN`.
- [ ] `/admin/login` is the only public admin route.
- [ ] `/admin/api/*` rejects requests without a valid admin session.
- [ ] Admin logout clears the admin session cookie.
- [ ] Products create/update/delete/publish/feature work in staging.
- [ ] Blog create/update/delete/publish works in staging.
- [ ] Lead magnets create/update/delete/publish work in staging.
- [ ] Leads are view-only.
- [ ] Lead CSV export includes consent and confirmation fields.

## Content Inventory

- [ ] First 10 launch articles are seeded in staging.
- [ ] Articles have SEO title and description.
- [ ] Articles have category, content type, difficulty, estimated reading minutes, and tags.
- [ ] Article copy is safe, educational, non-vulgar, and avoids unsupported medical claims.
- [ ] Internal links resolve.
- [ ] Lead magnet CTAs point to published lead magnet pages.

## Build And Deployment

- [ ] Run `npm run build`.
- [ ] Run `npx tsc --noEmit`.
- [ ] Run `npm run seed` only against the intended database.
- [ ] Start frontend with `npm run start`.
- [ ] Start backend with `npm run server` or production process manager equivalent.
- [ ] Confirm frontend and backend health routes are reachable.
- [ ] Confirm `/api/health` returns `{ "status": "ok" }`.
- [ ] Domain has HTTPS/SSL enabled.
- [ ] MongoDB Atlas network access is restricted to deployment/runtime IPs where possible.
- [ ] Hosting provider environment variables are configured separately for preview and production.
- [ ] Database backups are enabled and restoration has been tested.
- [ ] Basic uptime/error monitoring is enabled before paid traffic.
- [ ] Sentry receives frontend and backend test errors in production only.
- [ ] `.env`, `.env.local`, `.env.production`, `.next`, `.next-build`, and `node_modules` are ignored by git.

## Manual QA

Use [launch-qa-checklist.md](./launch-qa-checklist.md) before sending launch traffic.

## Remaining Launch Notes

- [ ] Add monitoring/error reporting before paid traffic.
- [ ] Create final branded Open Graph images.
- [ ] Review legal text with counsel for target markets.
- [ ] Confirm Nordic/international audience wording remains culturally neutral and premium.
