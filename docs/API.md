# API Surface

- `GET /api/health`
- `GET /api/me`
- `POST /api/auth/sign-in`
- `POST /api/auth/sign-up`
- `POST /api/auth/sign-out`
- `GET /api/opportunities`
- `POST /api/opportunities`
- `GET /api/opportunities/:id`
- `POST /api/campaigns`
- `POST /api/match`
- `GET /api/deals`
- `POST /api/deals`
- `PATCH /api/deals/:id`

All JSON writes are validated with Zod. Production expansion should add rate limiting, CSRF strategy for browser mutations, audit events on all material writes, idempotency keys for external transaction calls and granular RBAC.
