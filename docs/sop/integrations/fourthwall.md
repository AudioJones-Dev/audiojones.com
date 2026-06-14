---
title: Fourthwall Merch Integration
type: integration-sop
tags: [aj/integration, sop, merch, fourthwall]
updated: 2026-06-14
---

# Fourthwall Merch Integration

> [!danger] Never commit credentials
> All Fourthwall secrets live in environment variables (Vercel / Doppler) — never in the repo, client code, or chat. This repo is **public**. If a secret is ever exposed, rotate it in the Fourthwall dashboard immediately.

## What this integration does
- `/merch` — product catalog from the Fourthwall **Storefront API**.
- `/merch/[slug]` — product detail + "Buy now" → creates a cart → redirects to Fourthwall **hosted checkout**.
- `POST /api/fourthwall/cart` — creates a cart, returns the checkout URL.
- `POST /api/fourthwall/webhook` — receives order/product webhooks, **HMAC-verified**.

Everything degrades gracefully: with no env set, `/merch` shows a "store unavailable" state and the build still passes.

## Environment variables

| Var | Sensitivity | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_FOURTHWALL_STOREFRONT_TOKEN` | Publishable | Storefront read token (`ptkn_…`) |
| `NEXT_PUBLIC_FOURTHWALL_CHECKOUT_URL` | Publishable | Hosted-checkout base, e.g. `https://yourstore.fourthwall.com` |
| `FOURTHWALL_API_USERNAME` | **Secret** | Basic-auth user (Admin API) |
| `FOURTHWALL_API_PASSWORD` | **Secret** | Basic-auth password (Admin API) |
| `FOURTHWALL_HMAC_SECRET` | **Secret** | Webhook signature secret |

Set these in **Vercel → Settings → Environment Variables** (or Doppler). The `NEXT_PUBLIC_*` two are required for the storefront to render; the secrets are only needed for webhooks / Admin API.

## Webhook setup
1. In Fourthwall → Settings → Webhooks → Create webhook.
2. URL: `https://audiojones.com/api/fourthwall/webhook`
3. The route verifies the `X-Fourthwall-Hmac-SHA256` header (base64 HMAC-SHA256 of the raw body) against `FOURTHWALL_HMAC_SECRET`.
4. Handled events: `ORDER_PLACED`, `ORDER_UPDATED`, `PRODUCT_CREATED`, `PRODUCT_UPDATED` (extension points are stubbed with `TODO`).

## Verify before go-live
- Confirm the hosted-checkout redirect URL format against the live store — `createCartCheckoutUrl()` in `src/lib/fourthwall/storefront.ts` builds `${checkoutUrl}/checkout/?cartId=…`; adjust there if Fourthwall expects a different param for your shop.
- If product images fail to load, add the Fourthwall image CDN host to `next.config.ts` `images.remotePatterns` (currently they render via plain `<img>` to avoid the allowlist).

## Related
- [[Tier 5 - Supplementary Ecosystem]] · [[Offer Ecosystem]]
