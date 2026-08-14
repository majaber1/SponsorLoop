# Deployment

## Vercel-ready application

1. Push this repository to GitHub.
2. Import the repository into Vercel.
3. Set `SESSION_SECRET`.
4. Set `DATABASE_URL` for durable mode.
5. Run `sql/schema.sql` on the database before enabling real users.
6. Deploy and verify `/api/health`.

## Expected health states

- `database: demo` — app is running without durable DB.
- `database: connected` — PostgreSQL responded to `SELECT 1`.
- `ai: deterministic-fallback` — matching works without an LLM.
- `storage/payments/esign: not_configured` — expected until real providers are configured.

Do not convert external integration status to “healthy” based only on an environment variable in a future hardened version; add provider-specific connectivity checks and signed webhook verification.
