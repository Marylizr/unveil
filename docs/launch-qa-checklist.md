# UNVEIL Launch QA Checklist

Use this checklist before publishing content or sending launch traffic.

## Lead Magnet Funnel

- [ ] Open `/links` and confirm the page loads on desktop and mobile.
- [ ] Click the free guide link from `/links`.
- [ ] Confirm `/lead-magnets/body-literacy-checklist` loads with premium layout, privacy copy, and consent checkbox.
- [ ] Submit the lead form with a test email.
- [ ] Confirm the API creates the lead with `status: pending`.
- [ ] Confirm the lead record stores:
  - [ ] `source`
  - [ ] `requestedLeadMagnetSlug`
  - [ ] `consentText`
  - [ ] `consentVersion`
  - [ ] `consentedAt`
  - [ ] `privacyPolicyUrl`
- [ ] Confirm the confirmation email includes `/confirm-email?token=...`.
- [ ] Open `/confirm-email?token=...`.
- [ ] Confirm the lead changes from `pending` to `confirmed`.
- [ ] Confirm the welcome email includes `/download/body-literacy-checklist?token=...`.
- [ ] Open `/download/body-literacy-checklist?token=...`.
- [ ] Confirm the protected download page exposes the correct PDF link.
- [ ] Try `/download/wrong-slug?token=VALID_TOKEN` and confirm it is rejected.
- [ ] Try `/download/body-literacy-checklist?token=invalid` and confirm it is rejected.
- [ ] Open `/unsubscribe?token=...` from the welcome email.
- [ ] Confirm the lead gets `unsubscribedAt`.

## Analytics And Consent

- [ ] Load the site in production mode with GA4 and Clarity env vars set.
- [ ] Before accepting cookies, confirm GA4 and Clarity scripts do not load.
- [ ] Accept analytics in the cookie banner.
- [ ] Confirm GA4 loads.
- [ ] Confirm Clarity loads.
- [ ] Navigate between pages and confirm page views fire.
- [ ] Submit a newsletter form and confirm `lead_submission` and `newsletter_signup` events fire.
- [ ] Submit a lead magnet form and confirm `lead_submission` fires.
- [ ] Open a protected download and confirm `lead_magnet_download` fires.
- [ ] Open a product detail page and confirm `product_detail_view` fires.
- [ ] Open a journal article and confirm `article_view` fires.

## Content And SEO

- [ ] Run the seed script against a staging database.
- [ ] Confirm 10 launch articles appear in `/learn`.
- [ ] Open each article and verify title, excerpt, category, content type, difficulty, and reading time.
- [ ] Confirm internal links use safe educational wording.
- [ ] Confirm no explicit, vulgar, or adult-shop language appears.
- [ ] Confirm product catalog remains education-first and checkout-free.

## Responsive And Accessibility

- [ ] Test homepage, `/learn`, `/products`, `/links`, lead magnet page, thank-you page, confirmation page, download page, and unsubscribe page on mobile.
- [ ] Confirm text contrast is readable on olive/dark sections.
- [ ] Confirm forms have visible labels or screen-reader labels.
- [ ] Confirm keyboard focus reaches all buttons, links, filters, and form controls.
- [ ] Confirm cookie banner can be accepted or declined with keyboard only.

