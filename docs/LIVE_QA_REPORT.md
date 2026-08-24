# SponsorLoop — Live Production QA & Benchmark Report

**Test date:** 2026-08-24 (Asia/Riyadh)  
**Production URL:** https://sponsorloop-gold.vercel.app/ar  
**Benchmarks tested:** https://app.kliqapp.io/register and https://www.anvara.com/

## Release verdict

**NO-GO for public production today.** The public experience is polished, but the critical account-to-deal journey is not yet durable or complete. Release only after the P0 acceptance tests below pass with two fresh, independent accounts and a real PostgreSQL database.

## Personas and target journeys

1. **Rightsholder / opportunity owner:** event, sports club, podcast, venue, university community, creator, YouTube channel, TikTok profile, newsletter, app, outdoor media owner.
2. **Sponsor / buyer:** business or individual buyer that searches, compares, offers, negotiates, contracts, pays, approves delivery, and rates.
3. **Creator:** connects one or more social profiles (TikTok, YouTube, Instagram, Snapchat, X, LinkedIn, podcast) and sells campaign packages.
4. **Admin:** verifies identity/entity, moderates listings, resolves disputes, and controls claims shown as verified.

Agency and multi-brand enterprise workspaces are Phase 2. A sponsor/buyer role cannot be deferred because it is one side of the marketplace.

## Live tests performed

| Area | Result | Evidence / observation |
|---|---|---|
| Arabic home page | PASS | Loads, RTL navigation works, marketplace CTAs visible |
| Public opportunity cards | PASS with demo data | Prices, reach, audience, location, trust scores visible |
| Opportunity details | PASS with limitations | Packages, audience and ROI calculator visible; contact data includes placeholder WhatsApp |
| Marketplace filters | PASS | Search/filter journey works on current demo inventory |
| AI planner | FAIL | A SAR 30,000 budget produced a plan costing SAR 51,500 while showing no remaining budget |
| Sign-in page | PASS in demo mode | Demo credentials are displayed publicly |
| Sign-up route | PASS (form rendering) | A fresh direct load of /ar/auth/sign-up correctly shows name, organization, role, email and password. Account durability still requires production DB verification. |
| Durable accounts | NOT READY | UI states accounts become durable only when PostgreSQL is connected |
| Real two-party deal | NOT PROVEN | No evidence of a completed fresh-account owner→buyer→deal→delivery journey |
| Payments / escrow | NOT CONFIGURED | No production settlement provider |
| E-signature | NOT CONFIGURED | No production contract-signing provider |
| Storage | NOT CONFIGURED | No durable production evidence/document storage |
| Notifications | PARTIAL | Demo notifications visible; production delivery not proven |
| Security controls | NOT READY | Rate limiting, CSRF, fine RBAC, audit and production secret enforcement require completion |

## Kliq live benchmark findings

Kliq provides a simple first decision: **Brand** or **Creator**.

- Brand onboarding asks for brand name, contact name, email, Saudi phone and password.
- Creator onboarding asks for name and at least one social profile.
- TikTok is preselected and the interface supports adding additional profiles.
- Social sign-in is offered through Google and Facebook.
- Terms and privacy acknowledgement are embedded in registration.
- The product language emphasizes discovery, deals, contracts and payouts in one workspace.

### What SponsorLoop should adopt

- A role-first, short registration path.
- Creator profile connections during onboarding.
- Multi-channel creator identity and portfolio.
- A clear difference between business buyer information and creator information.
- Progressive onboarding: create account first, collect advanced verification later.

## Anvara live benchmark findings

Anvara separates **Brands**, **Rightsholders**, and **Agencies**. The public marketplace exposes category, audience, market, year, location, estimated audience and starting price, while full commercial details require access.

Rightsholder workflow:

1. List inventory with name, description, photos, assets, audience and pricing packages.
2. Control visibility and block competitors/categories.
3. Receive informed offers from qualified buyers.
4. Close inside a Deal Room containing creative, contracts, deadlines and updates.
5. Get paid through milestone-based escrow after delivery.

Other useful patterns:

- Success-fee model; listing is free.
- Public teaser plus gated full commercial data.
- Premium/exclusive listing flag.
- Structured sponsorship tiers and assets.
- Buyer vetting and seller-controlled visibility.
- Built-in reporting for reach, engagement and ROI.

## Required SponsorLoop marketplace inventory

- Live events and festivals
- Sports teams, tournaments, athletes and esports
- Conferences, exhibitions, hackathons and university communities
- Podcasts, newsletters and media programs
- YouTube channels and series
- TikTok, Instagram, Snapchat, X and LinkedIn creators
- Venues and physical advertising inventory
- Apps, websites and digital placements
- Charities and community initiatives
- Seasonal campaigns and experiential activations
- Naming rights, main partner, category-exclusive partner, booth/activation, content integration and media packages

Every listing must support deliverables, quantities, dates, exclusions, audience evidence, rights/media usage, category exclusivity, price/tier, availability and cancellation terms.

## P0 blockers before public launch

1. Verify sign-up persistence, validation, email verification and role enforcement against production PostgreSQL.
2. Connect production PostgreSQL and remove in-process/demo persistence.
3. Complete repository methods currently stubbed in database mode (messages, reviews, favorites, requests, notifications and related deal data).
4. Make the two-sided deal lifecycle durable: offer → counteroffer → acceptance → contract → payment status → delivery evidence → approval → rating.
5. Configure production secrets and fail closed when SESSION_SECRET is absent.
6. Add production object storage for listing media, contracts and delivery evidence.
7. Add transactional email; optional SMS/WhatsApp can follow.
8. Remove or clearly label demo testimonials, live-data claims, verified badges and placeholder contacts.
9. Fix the planner budget constraint.
10. Add admin moderation, reporting, suspension and dispute controls.
11. Add rate limiting, validation, authorization tests, audit events and basic observability.
12. Publish Arabic/English privacy, terms, marketplace rules, refund/cancellation and dispute policies.

## Ten-day execution gate

- **Days 1–2:** database, migrations, production auth, roles, sign-up, email verification.
- **Days 3–4:** owner listing creation/edit/moderation; creator profiles and packages.
- **Days 5–6:** buyer browse/save/offer/counter/accept; deal room and messages.
- **Days 7–8:** contract acceptance, payment-status integration, storage, delivery evidence.
- **Day 9:** admin tools, policies, monitoring, seed only explicitly labeled sample data.
- **Day 10:** full live acceptance test using two new accounts; fix/retest; production go/no-go.

## Mandatory production acceptance test

A release passes only when all state survives logout, new browser session and deployment:

1. Create an owner account and verify contact.
2. Publish a real sponsorship listing and admin-approve it.
3. Create a separate sponsor account.
4. Discover listing, inspect package and submit an offer.
5. Counter and accept.
6. Execute agreement and record/complete payment.
7. Exchange messages and creative/delivery files.
8. Owner submits evidence; sponsor approves it.
9. Close transaction and rate both sides.
10. Verify dashboards, notification delivery, audit records and authorization isolation.

## Current recommendation

Build **Saudi Anvara with Kliq-simple onboarding**: Anvara is the core marketplace and transaction reference; Kliq is the creator/brand onboarding reference. Do not ship the current demo as production until all P0 tests pass.
