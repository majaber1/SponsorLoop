# SponsorLoop — Live Operations QA (2026-08-25)

Production: https://sponsorloop-gold.vercel.app  
Deployment commit: `1eba680ff0aa675dd8e12442c8d5775404bf8d23`  
Internal production-readiness score: **89%**

## Production journey executed

All names are QA simulations and do not imply affiliation or a real sponsorship.

- Rights holder: `منتدى الرياض للابتكار — محاكاة QA`
- Advertiser: `علامة اتصالات سعودية — محاكاة QA`
- Opportunity: `076e9ff4-a6de-462b-b05e-cf672028bc91`
- Campaign: `91f6476a-7e58-4691-8c29-b339a0bf06a0`
- Deal: `3c76798c-dda8-4995-9f44-1a2c4b998927`
- Proposal version: `0fb795bc-f2c3-4f05-8073-9ef333b09831`
- Contract: `57089791-63a6-4cc9-804d-e0f9b7470c04`

Verified on live PostgreSQL: separate rights-holder/advertiser organizations, opportunity, campaign, deal, versioned proposal, contract draft, approval by both parties, payment-proof record, queued notification and dispute. The deal reached `seller_approved`; the contract reached `approved`.

The marketplace also displays public external reference opportunities from Anvara with source links and a prominent “not offered or verified by SponsorLoop” notice.

## Safety and remaining external connections

- Electronic signature request correctly returns `409` until an external provider is configured.
- R2 upload correctly returns `503` until R2 secrets are present.
- Email is durably queued until Resend and a verified sender domain are configured.
- Payment is a `pending_review` record only; no custody/escrow claim is made.
- Runtime error/fatal logs after the test: none.

The 21-stage workflow, 5% platform fee, notices and reference sources are versioned in `workflow_policies` for later commercial/legal adjustment.
