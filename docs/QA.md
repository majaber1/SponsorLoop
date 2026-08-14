# V2 QA Checklist

## Functional
- Arabic and English landing pages
- RTL / LTR direction
- Marketplace text, category, city and budget filtering
- Planner returns ranked existing opportunities only
- Campaign creation returns to planner
- Opportunity listing creates inventory in demo or DB mode
- Opportunity detail starts a deal
- Deal stage moves sequentially
- Demo sign-in works with documented credentials
- DB sign-up hashes the password and creates organization membership transactionally
- `/api/health` separates DB, AI, storage, payment and e-sign state

## Security / integrity
- HttpOnly session cookie
- No plaintext DB passwords
- Zod validation on JSON mutations
- No fake payment/e-sign result
- Deterministic matching before optional LLM explanation
- Production requires strong `SESSION_SECRET`

## Production hardening still required before money movement
- Provider-specific payment integration + verified webhooks
- E-sign integration + callback validation
- Durable object storage and malware/file validation
- Rate limiting / anti-abuse
- CSRF review for mutation endpoints
- Fine-grained RBAC + maker/checker
- Audit log coverage for all financial and verification changes
- Observability and alerting
