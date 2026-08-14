# SponsorLoop V2 Architecture

## Runtime

Browser → Next.js App Router → Route Handlers → Repository Layer → PostgreSQL or Demo Store.

The UI and APIs do not branch into two products. The repository layer is the only data-mode boundary.

## Core domains

1. Identity & organizations
2. Marketplace inventory
3. Campaign briefs
4. Matching intelligence
5. Deals and proposal lifecycle
6. Trust / verification
7. Measurement
8. Billing / external transaction references

## Security model

- Passwords are hashed with bcrypt in DB mode.
- Session is a signed HttpOnly cookie.
- Production should use a random 32+ byte `SESSION_SECRET`.
- DB writes derive organization identity from the session where applicable.
- High-value deal transitions should later gain maker/checker authorization.
- Payment and e-sign state must only advance from provider-confirmed callbacks in a hardened production release.

## Matching guardrail

Candidates come from actual marketplace inventory. Deterministic scoring happens before any optional model call. This makes recommendations explainable and prevents hallucinated listings.

## External integration boundaries

- Object storage: media kits, proposal PDFs, contracts, fulfillment evidence
- Payment provider: payment intents and verified callbacks; SponsorLoop should not imply custody of funds by default
- E-sign provider: contract envelopes and verified completion callbacks
- Verification providers: only approved sources / APIs

V2 deliberately does not claim these external systems are connected when credentials are absent.
