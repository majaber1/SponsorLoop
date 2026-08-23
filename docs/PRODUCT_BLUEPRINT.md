# SponsorLoop Product Blueprint

## Vision

The first Saudi-built bilingual sponsorship and advertising marketplace — connecting brands with rights-holders across events, creators, podcasts, sports, digital, OOH, community, gaming, athletes, hackathons, and clubs.

## Core Principles

1. **Saudi-first, GCC-ready** — Arabic/RTL is native, not an afterthought. SAR currency, Saudi cities, local audience segments.
2. **Explainable AI matching** — Every recommendation shows the deterministic scoring components. No black-box suggestions.
3. **Trust through transparency** — Verification queue, trust scores, compliance audit trail. Nothing is verified without evidence.
4. **Full deal lifecycle** — From discovery through negotiation, contract, payment, delivery, and measurement.
5. **Honest simulation** — Payment and e-signature stages are clearly labeled as demo simulations. No false claims of completed transactions.

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with React 19
- **Language**: TypeScript with Zod validation at API boundaries
- **Styling**: Custom CSS with design tokens (no framework dependency)
- **Auth**: JWT sessions via jose, HttpOnly cookies
- **Data**: Dual-mode — in-memory demo (globalThis singleton) or PostgreSQL
- **AI**: Optional external AI provider for narrative explanations; core matching is deterministic

### Dual-Mode Data Architecture
- **Demo mode** (DATABASE_URL not set): In-memory state via `lib/demo-store.ts` with `globalThis` singleton. 4 demo accounts with hardcoded credentials. State resets on server restart or via `/api/demo-reset`.
- **Production mode** (DATABASE_URL set): PostgreSQL with full schema. bcrypt password hashing, proper RBAC, audit trails.

### Route Structure
```
app/
  [locale]/           # ar | en — sets dir="rtl"|"ltr"
    page.tsx           # Landing page
    marketplace/       # Browse & filter opportunities
    planner/           # AI campaign planner
    deals/             # Deal pipeline list
    deals/[id]/        # Deal Room with proposal builder, deliverables, messages
    requests/          # Reverse marketplace — rights-holders posting needs
    analytics/         # Dashboard analytics with pipeline, categories, quality
    insights/          # Market intelligence benchmarks
    compare/           # Side-by-side opportunity comparison
    compliance/        # Trust & compliance center
    pricing/           # Subscription tiers + success fee
    dashboard/         # Brand workspace
    dashboard/owner/   # Rights-holder inventory management
    admin/             # Operations & moderation (verification queue)
    campaigns/new/     # Campaign creation form
    opportunities/new/ # Opportunity listing form
    opportunities/[id]/ # Opportunity detail + booking
    auth/sign-in/      # Authentication with demo quick-login
    auth/sign-up/      # Registration with role selection
```

## User Roles

| Role | Description | Key Actions |
|------|-------------|-------------|
| **Advertiser** | Brand seeking sponsorship opportunities | Browse marketplace, create campaigns, AI matching, initiate deals |
| **Owner** | Rights-holder listing inventory | List opportunities, manage packages, respond to deals, track deliverables |
| **Agency** | Manages multiple brands or properties | All advertiser + owner actions, multi-client management |
| **Admin** | Platform operator | Verification queue, approve/reject listings, view all deals, system oversight |

## Matching Algorithm (lib/matching.ts)

8-component weighted scoring:
1. **Budget fit** (25%) — How well the opportunity price fits the campaign budget
2. **Objective alignment** (20%) — Category-objective affinity matrix
3. **City match** (15%) — Geographic alignment
4. **Category preference** (10%) — Explicit category selection match
5. **Audience overlap** (10%) — Keyword overlap between campaign audience and opportunity audience
6. **Trust score** (8%) — Verification and platform trust metrics
7. **Availability** (7%) — Current availability score
8. **Performance** (5%) — Historical performance metrics

Every match returns bilingual explanations (reasonsAr + reasonsEn) detailing why it scored high or low.

## 7-Stage Deal Pipeline

```
request → negotiation → approval → contract → payment → delivery → completed
```

Each stage transition creates an audit event. Payment and contract stages are simulation-only without external provider integration.

## Demo Content

- **24+ opportunities** across all 11 categories and 7 Saudi cities
- **5 deals** at various pipeline stages
- **5 notifications** (deal updates, matches, verification, system)
- **5 sponsorship requests** (reverse marketplace)
- **4 success stories** with ROI metrics
- **3 unverified opportunities** for admin verification testing
- **4 demo accounts** with quick-login buttons

## Key Features by Release Priority

### V1 (Current — Demo-Ready)
- Bilingual marketplace with 11 categories
- AI campaign planner with explainable matching
- 7-stage Deal Room with proposal builder and deliverables
- Reverse marketplace (sponsorship requests)
- Admin verification queue with approve/reject
- Trust & compliance center
- Market intelligence / insights
- Side-by-side comparison tool
- Analytics dashboard with pipeline visualization
- Mobile-responsive with hamburger nav
- Demo account quick-login

### V2 (Post-Launch)
- Real payment integration (mada, STC Pay, SADAD)
- E-signature integration (DocuSign or local provider)
- Notification preferences and email alerts
- Advanced RBAC with team management
- API access for enterprise integrations
- Media kit upload and management
- Calendar integration for activation scheduling

### V3 (Growth)
- Multi-tenant agency dashboard
- Automated ROI reporting with connected analytics
- Recommendation engine trained on closed-deal data
- GCC market expansion (UAE, Bahrain, Kuwait, Oman, Qatar)
- WhatsApp Business API integration
- Automated contract generation from deal terms
