# Stripe-Ready Sales Infrastructure

Stripe is not connected yet. This document describes the architecture now in place for a future Stripe Checkout and webhook phase.

## Sales Pages

- `/modern-man-code`
- `/understanding-female-pleasure`
- `/the-art-of-connection`

Each page is education-first and uses disabled checkout messaging until Stripe is connected.

## Future Stripe Environment Variables

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `RESEND_FROM_EMAIL`

Do not expose secret Stripe keys to the browser.

## Order Lifecycle

1. Future checkout endpoint creates an `Order` with `status: "pending"`.
2. Stripe Checkout Session is created server-side.
3. Stripe webhook verifies the event with `STRIPE_WEBHOOK_SECRET`.
4. On verified payment success, order status becomes `paid`.
5. `fulfillPaidOrder(orderId)` creates entitlements for purchased digital products.
6. Delivery email sends one-time raw download tokens to the customer.

## Entitlement Lifecycle

1. Entitlement is created only after verified payment.
2. Raw download token is generated once.
3. Only the SHA-256 token hash is stored.
4. `/api/digital-assets/:productId?token=...` verifies the token hash, product, active status, and expiration.
5. Download count and last downloaded timestamp are recorded.
6. Admin can revoke entitlement access.

## Paid PDF Storage Rules

- Paid PDFs must never live in `/public/downloads`.
- Local development uses `PRIVATE_DIGITAL_ASSETS_DIR` or `private/digital-assets`.
- Production should move paid files to S3, Cloudflare R2, or another private object store.
- `s3://` and `r2://` URLs may be stored now but are not served until storage integration is implemented.

## Manual QA Before Payments

- Confirm public sales pages load.
- Confirm product records include price, currency, protected asset fields, and Stripe placeholder fields.
- Confirm public product API does not expose `digitalAssetUrl`, `stripeProductId`, `stripePriceId`, supplier fields, or internal notes.
- Confirm admin `/admin/orders` and `/admin/entitlements` are protected.
- Confirm entitlement tokens are hashed in the database.
- Confirm invalid paid download token returns `401`.
- Confirm wrong product/token combination returns `401`.
- Confirm revoked entitlement is rejected.
- Confirm Sentry is active in production.
- Confirm legal pages and responsible-use language are visible before checkout is enabled.
