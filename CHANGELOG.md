# Changelog

## [1.0.0] - 2026-08-23

### Added
- **Marketplace** with 20+ Saudi sponsorship opportunities across 11 categories and 7 cities
- **AI-Powered Planner** with explainable 8-component matching algorithm (audience fit, budget match, reach, trust, timing, category, geographic, performance)
- **Deal Room** with versioned proposal builder, deliverables tracker, and messaging
- **7-Stage Deal Pipeline**: request, negotiation, approval, contract, payment, delivery, completed
- **Admin Panel** with verification queue (approve/reject), KPI dashboard, and deal pipeline overview
- **Reverse Marketplace** (Requests): rights-holders post sponsorship requests that brands can browse
- **Analytics Dashboard** with spend tracking, ROI metrics, and campaign performance
- **Insights** page with market trends and industry benchmarks
- **Compare Tool** for side-by-side opportunity evaluation
- **Compliance Center** with Saudi regulatory guidelines and brand safety scoring
- **Pricing Page** with Free, Pro, and Enterprise tiers
- **Favorites** system with heart toggle on marketplace cards
- **Full Bilingual Support** (Arabic RTL / English LTR) via route-based locale switching
- **Responsive Design** tested at 375px, 768px, 1024px, and 1440px breakpoints
- **Demo Mode** with 4 quick-login accounts (Brand, Owner, Agency, Admin) and realistic Saudi data
- **Owner Dashboard** for rights-holders showing their listed opportunities and incoming deals
- **Opportunity Detail Pages** with ROI calculator, audience breakdown, and similar opportunities
- **Mobile Navigation** with hamburger menu and slide-out drawer
- **Sign-out** functionality with session cookie management

### Architecture
- Next.js 16 with React 19 and TypeScript
- Dual-mode data layer: in-memory demo store + PostgreSQL production mode
- JWT sessions via jose library with HttpOnly cookies
- Zod validation on all API endpoints
- 11 opportunity categories, 7 Saudi cities, 4 user roles

### Documentation
- Product Blueprint (PRODUCT_BLUEPRINT.md)
- Top 5 Competitor Research (TOP_5_PRODUCT_RESEARCH.md)
- Feature Gap Matrix (FEATURE_GAP_MATRIX.md)
- QA Test Report with 19 screenshot evidence files (LIVE_DEMO_TEST_REPORT.md)
