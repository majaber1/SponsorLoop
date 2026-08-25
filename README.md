# SponsorLoop V2

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/majaber1/SponsorLoop)

Saudi-first bilingual sponsorship and advertising marketplace. V2 upgrades the interactive prototype into a production-oriented Next.js application with real API boundaries, authentication, PostgreSQL support and explainable matching.

**Enhanced with features from top international platforms** (SponsorUnited, OpenSponsorship, Sponsorium, DoSponsor).

## What works

- Arabic and English routes (`/ar`, `/en`) with real RTL/LTR
- Marketplace with sort, filter, grid/list views, and featured badges
- 17 demo opportunities across 7 Saudi cities (Riyadh, Jeddah, Dammam, Makkah, Madinah, Khobar, Tabuk)
- Opportunity detail and sell-side listing flow
- Side-by-side opportunity comparison tool (up to 3)
- Campaign creation flow
- Explainable AI Planner / matching API
- Advertiser dashboard
- Rights-holder dashboard
- Analytics dashboard with pipeline charts, category breakdown, geographic distribution, quality metrics
- Deals list + staged Deal Room with in-deal messaging/activity timeline
- In-app notification system with bell icon and dropdown
- Favorites/bookmarks API
- Post-deal review/rating system
- Admin / verification queue
- Pricing model
- Trust & compliance center
- Email/password auth with signed HttpOnly session cookie
- Demo mode with no database required (5 demo deals at various stages)
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

Set `OPENAI_API_KEY` as a server-only secret and optionally set `OPENAI_MODEL` (defaults to `gpt-5.4-mini`). Authenticated users receive a bilingual ChatGPT explanation of the deterministic ranking and can create an AI-assisted proposal draft in the deal room. OpenAI is never allowed to invent inventory, pricing, reach or metrics, and every generated proposal is labelled for human review.

## Production deployment

See `docs/DEPLOYMENT.md`. A Vercel deployment can host the Next.js app, but durable operation additionally requires PostgreSQL. Object storage, payment and e-sign are explicit external integrations and V2 reports them separately.
