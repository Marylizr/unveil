# Private Digital Assets

Paid ebooks, PDFs, guides, and future course downloads belong here only for local development.

Do not place paid digital products in `public/downloads`. Files in `public/downloads` are directly reachable by URL and should be limited to free lead magnets.

Production should use private object storage such as S3 or Cloudflare R2, then deliver assets through a server route or signed URL after purchase entitlement verification.

Local protected route shape:

`GET /api/digital-assets/:productId?token=:downloadToken`

The route verifies a matching entitlement token before reading from this private folder. Entitlement download tokens are stored as hashes, not raw tokens.

Admin tooling:

- `/admin/digital-assets` uploads and browses private files for local development.
- Product editor fields can select a private `digitalAssetUrl` and mark the product as a protected asset.

External storage URLs such as `s3://...` or `r2://...` are reserved for the Stripe/storage phase and are not served yet.
