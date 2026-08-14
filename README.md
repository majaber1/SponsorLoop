# SponsorLoop V2

Saudi-first bilingual sponsorship and advertising marketplace. V2 upgrades the interactive prototype into a production-oriented Next.js application with real API boundaries, authentication, PostgreSQL support and explainable matching.

## What works

- Arabic and English routes (`/ar`, `/en`) with real RTL/LTR
- Marketplace + client-side filters
- Opportunity detail and sell-side listing flow
- Campaign creation flow
- Explainable AI Planner / matching API
- Advertiser dashboard
- Rights-holder dashboard
- Deals list + staged Deal Room
- Admin / verification queue
- Pricing model
- Trust & compliance center
- Email/password auth with signed HttpOnly session cookie
- Demo mode with no database required
- PostgreSQL production mode through `DATABASE_URL`
- Health endpoint showing DB / AI / storage / payments / e-sign status

## Visual preview without dependencies

Open `preview.html` directly in a browser. It is a static visual preview only; the full application is the Next.js project.

## Fastest local run

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000/ar`.

### Demo credentials

- Email: `demo@sponsorloop.sa`
- Password: `Demo123!`

When `DATABASE_URL` is empty, the app uses in-process demo data. This is intentionally non-durable and must not be mistaken for production persistence.

## PostgreSQL mode

1. Provision a PostgreSQL database.
2. Run `sql/schema.sql`.
3. Optionally run `sql/seed.sql`.
4. Set `DATABASE_URL` and a strong `SESSION_SECRET`.
5. Restart the app.
6. Create the first durable account from `/ar/auth/sign-up`.

## Health

`GET /api/health`

The endpoint never fakes external integrations. It reports `not_configured` for storage, payments and e-sign until their environment variables are actually set.

## AI matching

The ranking is deterministic first. Weights:

- Audience: 25%
- Objective/channel: 20%
- Budget/value: 15%
- Geography: 10%
- Trust: 10%
- Historical performance: 10%
- Availability: 5%
- Brand safety / verified state: 5%

If `AI_PROVIDER_URL`, `AI_PROVIDER_API_KEY` and `AI_MODEL` are configured, the LLM may explain/re-rank the supplied candidates but is instructed not to invent inventory, pricing, reach or metrics.

## Production deployment

See `docs/DEPLOYMENT.md`. A Vercel deployment can host the Next.js app, but durable operation additionally requires PostgreSQL. Object storage, payment and e-sign are explicit external integrations and V2 reports them separately.
