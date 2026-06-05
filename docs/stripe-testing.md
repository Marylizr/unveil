# Stripe Testing

Use Stripe test mode only until production legal, delivery, and support checks are complete.

## Environment

Set these locally or in your hosting preview environment:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `MONGODB_URI`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

## Stripe CLI

1. Install and log in to Stripe CLI.
2. Forward webhooks:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

3. Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

## Local Test Flow

1. Start UNVEIL:

```bash
npm run dev:all
```

2. Open one sales page:

- `http://localhost:3000/modern-man-code`
- `http://localhost:3000/understanding-female-pleasure`
- `http://localhost:3000/the-art-of-connection`

3. Enter an email and start checkout.
4. Use Stripe test card:

```text
4242 4242 4242 4242
Any future date
Any CVC
Any postal code
```

5. Confirm redirect to `/checkout/success`.
6. Confirm the Stripe CLI receives `checkout.session.completed`.
7. Confirm the matching order becomes `paid`.
8. Confirm an entitlement is created with `downloadTokenHash`, not a raw token.
9. Confirm the delivery email includes `/api/digital-assets/:productId?token=...`.
10. Confirm the download route serves the file only with the correct token.

## Failure Tests

- Wrong token returns `401`.
- Wrong product/token combination returns `401`.
- Revoked entitlement returns `401`.
- Expired entitlement returns `401`.
- Missing private asset returns `404`.
- `s3://` or `r2://` asset paths return `501` until private object storage is connected.

## Webhook Idempotency

Replay the same event from Stripe CLI. The order should remain `paid`, and duplicate entitlements should not be created.

## Production Checklist Before Live Mode

- Verify Stripe webhook endpoint uses HTTPS.
- Verify `STRIPE_WEBHOOK_SECRET` is from the production webhook endpoint.
- Verify product prices in Stripe match MongoDB product records.
- Verify paid PDFs are outside `/public/downloads`.
- Verify Resend sender domain SPF, DKIM, and DMARC.
- Verify support email and refund terms are visible.
