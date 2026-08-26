# SponsorLoop V2 Architecture

Last verified against current repository and production health: **2026-08-26**.

## Runtime

Browser → Next.js App Router → Route Handlers → Repository Layer → PostgreSQL or Demo Store.

The UI and APIs do not branch into two products. The repository layer is the data-mode boundary. Production dependency readiness is exposed by `GET /api/health`; the health response is the operational source of truth and must not be inferred from diagrams or old QA reports.

## Core domains

1. Identity & organizations
2. Marketplace inventory
3. Campaign briefs
4. Matching intelligence
5. Deals and proposal lifecycle
6. Trust / verification
7. Measurement
8. Billing / external transaction references

## Persistence and storage

### PostgreSQL

Durable transactional data uses PostgreSQL when `DATABASE_URL` is configured. When it is absent the application can operate in explicit non-durable demo mode.

### Cloudflare R2

Media/document uploads are implemented against Cloudflare R2 using the S3-compatible client and these server-side environment variables:

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`

All four variables are required before health reports storage as configured. As of the 2026-08-26 verification, the implementation is present but production health reports R2 as **not configured**. This is a deployment-secret/configuration gap, not a missing storage implementation.

## Health contract

`GET /api/health` reports safe readiness only; it never returns secret values. Current health dimensions include:

- application status
- database
- AI provider/fallback state
- object storage and provider
- payments
- e-sign

Jaber Dashboard should consume this endpoint rather than copying storage/AI/database claims manually.

## Security model

- Passwords are hashed with bcrypt in DB mode.
- Session is a signed HttpOnly cookie.
- Production should use a random 32+ byte `SESSION_SECRET`.
- DB writes derive organization identity from the session where applicable.
- High-value deal transitions should later gain maker/checker authorization.
- Payment and e-sign state must only advance from provider-confirmed callbacks in a hardened production release.
- R2 credentials are server-side secrets and must never be committed or returned by health.

## Matching guardrail

Candidates come from actual marketplace inventory. Deterministic scoring happens before any optional model call. This makes recommendations explainable and prevents hallucinated listings.

## External integration boundaries

- **Cloudflare R2:** media kits, proposal PDFs, contracts and fulfillment evidence.
- **Payment provider:** payment intents and verified callbacks; SponsorLoop should not imply custody of funds by default.
- **E-sign provider:** contract envelopes and verified completion callbacks.
- **Verification providers:** only approved sources / APIs.

SponsorLoop deliberately does not claim external systems are connected when credentials are absent. Operational status must be read from health at runtime.
