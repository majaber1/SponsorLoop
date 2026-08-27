# SponsorLoop Growth Engine

Last reviewed: 2026-08-27

## Objective

Turn SponsorLoop into a two-sided growth system that acquires creators/rights-holders and sponsors/brands, qualifies them, invites them into the platform, and recommends the strongest sponsorship matches once both sides are available.

The engine is intentionally **not** a blind scraping/spam bot. Discovery and messaging should use approved platform capabilities where available (TikTok One / TikTok API for Business / Business Messaging) and retain human approval before external outreach until the connector has passed production QA.

## Core agents

### 1. Creator Scout

Purpose: discover and rank active creator accounts that could carry sponsorship inventory.

Signals:
- platform and public profile URL
- follower count
- recent/average views
- engagement rate
- category/content themes
- geography
- indicative sponsorship rate range
- Mawthooq verification state for Saudi individual advertisers

Source priority:
1. TikTok One / Creator Marketplace official discovery
2. TikTok API for Business discovery capabilities
3. agency/referral feeds
4. admin CSV/manual import

Scraping or automated behavior that violates platform terms is outside the product boundary.

### 2. Brand Scout

Purpose: qualify potential sponsors and advertisers.

Signals:
- category/industry
- geography
- desired audience
- declared campaign budget range
- campaign objective
- channel/platform preference
- existing social footprint

The first release supports admin/manual/referral intake. CRM/lead-generation connectors can be added behind the same lead model later.

### 3. Outreach Copilot

Purpose: create personalized creator/brand invitations.

State machine:
`draft → approved → sent → replied → joined | declined | failed`

Rules:
- external sending is not automatic by default
- drafts require admin approval
- `GROWTH_AUTOSEND_ENABLED` defaults to false
- marking a message as `sent` in the MVP records an operational fact; it does not impersonate a TikTok API response
- official Business Messaging integration is the preferred future send channel

### 4. Matchmaker

Purpose: match sponsor demand to creator/sponsorship supply.

Current score weights for external growth leads:
- budget compatibility: 25%
- category overlap: 25%
- audience overlap: 20%
- geography: 10%
- compliance readiness: 10%
- creator qualification quality: 10%

Example:
A sponsor with a SAR 400–700 budget will rank a creator asking SAR 450–900 much higher than a creator asking SAR 5,000+.

Once a creator/rights-holder and brand are onboarded into SponsorLoop, the platform's existing opportunity/campaign matching and deal workflow remain the canonical transaction flow.

### 5. Compliance Gate

Purpose: prevent operational activation before the required advertising checks are complete.

For Saudi creator advertising workflows, the admin console records Mawthooq status and a verification reference. The Growth Engine does not claim an official Mawthooq API integration unless one is formally available and connected.

The compliance gate should also enforce clear advertising disclosure and should never convert self-declared claims into verified status without evidence.

## Funnel

`Discovered → Qualified → Invited → Joined → Matched → Deal`

The current lead status model covers the acquisition stages. Matching is calculated dynamically. The downstream canonical SponsorLoop opportunity/campaign/deal system covers transaction stages.

## Data model

### growth_leads
External creator/brand prospects before they become SponsorLoop organizations/users.

Key fields:
- side: creator / brand
- source: TikTok One, TikTok Business API, manual, CSV, referral, platform
- social/account metrics
- creator rate range or brand budget range
- Mawthooq status/reference
- qualification score
- acquisition status

### growth_outreach
Human-reviewed outreach drafts and operational state.

### growth_matches
Matches are currently calculated dynamically from `growth_leads` so no stale persisted score is presented as current truth.

## Admin page

Route:

`/[locale]/admin/growth`

It contains:
- acquisition KPIs
- five agent cards
- connector readiness
- funnel
- lead intake
- scout queue
- Mawthooq verification action
- outreach queue
- ranked creator-brand matches

Admin API:

`GET /api/admin/growth`
`POST /api/admin/growth`

Production access requires an admin session when `DATABASE_URL` is configured.

## Connector readiness

Application-defined environment variables:

- `TIKTOK_API_FOR_BUSINESS_ACCESS_TOKEN`
- `TIKTOK_BUSINESS_ID`
- `TIKTOK_BUSINESS_MESSAGING_ENABLED`
- `GROWTH_AUTOSEND_ENABLED`

These variables do not grant TikTok access themselves. The TikTok developer/business application must be approved for the relevant products and permissions.

## Official platform basis reviewed

- TikTok One / Creator Marketplace: official creator-brand collaboration platform
- TikTok API for Business: Marketing, Organic/TikTok One/Discovery, and Business Messaging API families
- TikTok One direct invitations, invite links, open applications and creator collaboration workflows
- Saudi General Authority of Media Regulation Mawthooq licensing/verification service

## Safety and commercial policy

- no blind mass DMs
- no credential sharing
- no fabricated follower/engagement numbers
- no fake Mawthooq verification
- no automatic activation of a Saudi influencer sponsorship when required compliance evidence is missing
- frequency caps and suppression lists should be added before enabling automated sending
- brands and creators must be able to opt out of future outreach

## Phase 2 connector work

1. Approved TikTok One / API for Business integration
2. Official creator discovery import
3. Business Messaging send/reply webhooks if approved
4. CRM/email/WhatsApp business connector for brand outreach
5. automatic opt-out/suppression registry
6. campaign brief → creator shortlist → invite workflow
7. conversion attribution from lead source to joined user to deal/revenue
8. scheduled agent runs and admin approval queue
