# SponsorLoop V2

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/majaber1/SponsorLoop)

Saudi-first bilingual sponsorship and advertising marketplace. V2 upgrades the interactive prototype into a production-oriented Next.js application with real API boundaries, authentication, PostgreSQL support and explainable matching.

**Enhanced with features from top international platforms** (SponsorUnited, OpenSponsorship, Sponsorium, DoSponsor).

## Operational source of truth

Last verified: **2026-08-27**.

| Layer | Canonical source | Current verified state |
| --- | --- | --- |
| Code | `main` in this repository | Active Next.js application |
| Production | `https://sponsorloop-gold.vercel.app` | Deployed |
| Health | `GET /api/health` | DB connected; AI deterministic fallback when OpenAI is absent |
| Database | `DATABASE_URL` | PostgreSQL supported and health-reported |
| Object storage | Cloudflare R2 via `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` | Code ready; production health reports readiness truthfully |
| AI | `OPENAI_API_KEY` + optional `OPENAI_MODEL` | Optional; deterministic ranking remains the base behavior |
| Growth Engine | `/[locale]/admin/growth` | Admin acquisition/matching control plane; official TikTok connectors remain gated until credentials/approval exist |
| Payments | Provider boundary | Not configured unless health says otherwise |
| E-sign | Provider boundary | Not configured unless health says otherwise |
| Architecture | `docs/ARCHITECTURE.md` + `docs/GROWTH_ENGINE.md` | Canonical architecture documents |

**Runtime health overrides prose.** If this README, an old QA report, or the dashboard disagrees with `/api/health` or current `main`, treat live health and current code as authoritative and update the documentation.

Machine-readable portfolio metadata is in `.jaber-dashboard.json` for Jaber Dashboard synchronization.

## What works

- Arabic and English routes (`/ar`, `/en`) with real RTL/LTR
- Marketplace with sort, filter, grid/list views, and featured badges
- Opportunity detail and sell-side listing flow
- Side-by-side opportunity comparison tool
- Campaign creation flow
- Explainable AI Planner / matching API
- Advertiser and rights-holder dashboards
- Analytics dashboard
- Deals + staged Deal Room
- Notifications, favorites and reviews
- Admin / verification queue
- Trust & compliance center
- Email/password auth with signed HttpOnly session cookie
- Demo mode with no database required
- PostgreSQL production mode through `DATABASE_URL`
- Cloudflare R2 upload implementation
- Health endpoint showing DB / AI / storage / payments / e-sign status
- **Admin Growth Engine** for creator/brand lead intake, qualification, outreach drafting, Mawthooq tracking, acquisition funnel and budget-aware creator-brand matching

## Growth Engine

Admin route:

```text
/ar/admin/growth
/en/admin/growth
```

The Growth Engine contains five operating agents:

1. **Creator Scout** — discover/rank creator prospects.
2. **Brand Scout** — qualify sponsor demand and declared budgets.
3. **Outreach Copilot** — draft bilingual outreach; human approval is required before external sending.
4. **Matchmaker** — pair creators and sponsors using budget, category, audience, geography and compliance fit.
5. **Compliance Gate** — record Mawthooq verification/evidence before Saudi creator activation.

The product does **not** implement blind TikTok scraping or mass unsolicited messaging. The preferred integration is TikTok One / TikTok API for Business / Business Messaging after SponsorLoop receives the relevant platform access. Until then, intake can be manual/CSV/referral and the same matching/outreach workflow remains usable.

See [`docs/GROWTH_ENGINE.md`](docs/GROWTH_ENGINE.md) for architecture, connector rules and the acquisition funnel.

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

Growth Engine tables are created safely on first admin Growth Engine access through `ensureGrowthEngine()`.

## Health

`GET /api/health`

The endpoint is the operational truth for configured dependencies. It reports `not_configured` for external integrations until their required environment variables are actually set. It does not expose secret values.

## AI matching

The core opportunity ranking remains deterministic first. Set `OPENAI_API_KEY` as a server-only secret and optionally set `OPENAI_MODEL` (defaults to `gpt-5.4-mini`). OpenAI is never allowed to invent inventory, pricing, reach or metrics, and generated copy remains subject to human review.

## Production deployment

See `docs/DEPLOYMENT.md`. A Vercel deployment can host the Next.js app, but durable operation additionally requires PostgreSQL. Media/document uploads use Cloudflare R2 when the four `R2_*` production variables are present. Payment, e-sign and TikTok Business integrations remain explicit external integrations and are reported separately rather than simulated as connected.
