import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { databaseEnabled, pool, query } from "./db";
import { demoState } from "./demo-store";
import type { CampaignInput, Deal, DealStage, Opportunity, OpportunityCategory, SessionUser, SponsorshipRequest } from "./types";

function rowToOpportunity(row: any): Opportunity {
  return {
    id: row.id,
    organizationId: row.organization_id,
    organizationNameAr: row.organization_name_ar ?? row.organization_name_en,
    organizationNameEn: row.organization_name_en,
    category: row.category,
    titleAr: row.title_ar,
    titleEn: row.title_en,
    descriptionAr: row.description_ar ?? "",
    descriptionEn: row.description_en ?? "",
    city: row.city ?? "Riyadh",
    startingPrice: Number(row.starting_price),
    currency: row.currency,
    estimatedReach: Number(row.estimated_reach ?? 0),
    audience: Array.isArray(row.audience_json) ? row.audience_json : row.audience_json?.segments ?? [],
    formats: Array.isArray(row.format_json) ? row.format_json : row.format_json?.formats ?? [],
    verified: row.verification_status === "verified",
    featured: Boolean(row.featured),
    trustScore: Number(row.trust_score ?? 80),
    availabilityScore: Number(row.availability_score ?? 80),
    performanceScore: Number(row.performance_score ?? 75)
  };
}

export async function listOpportunities(filters?: { category?: string; city?: string; q?: string }) {
  if (!databaseEnabled) {
    let data = demoState.opportunities;
    if (filters?.category && filters.category !== "all") data = data.filter((x) => x.category === filters.category);
    if (filters?.city && filters.city !== "all") data = data.filter((x) => x.city.toLowerCase() === filters.city!.toLowerCase());
    if (filters?.q) {
      const q = filters.q.toLowerCase();
      data = data.filter((x) => `${x.titleAr} ${x.titleEn} ${x.organizationNameAr} ${x.organizationNameEn}`.toLowerCase().includes(q));
    }
    return data;
  }

  const values: unknown[] = [];
  const where = ["o.status = 'published'"];
  if (filters?.category && filters.category !== "all") {
    values.push(filters.category);
    where.push(`o.category = $${values.length}`);
  }
  if (filters?.city && filters.city !== "all") {
    values.push(filters.city);
    where.push(`LOWER(o.city) = LOWER($${values.length})`);
  }
  if (filters?.q) {
    values.push(`%${filters.q}%`);
    where.push(`(o.title_ar ILIKE $${values.length} OR o.title_en ILIKE $${values.length} OR org.name_ar ILIKE $${values.length} OR org.name_en ILIKE $${values.length})`);
  }
  const result = await query<any>(`
    SELECT o.*, org.name_ar AS organization_name_ar, org.name_en AS organization_name_en
    FROM opportunities o
    JOIN organizations org ON org.id = o.organization_id
    WHERE ${where.join(" AND ")}
    ORDER BY o.featured DESC, o.created_at DESC
  `, values);
  return result.rows.map(rowToOpportunity);
}

export async function getOpportunity(id: string) {
  if (!databaseEnabled) return demoState.opportunities.find((x) => x.id === id) ?? null;
  const result = await query<any>(`
    SELECT o.*, org.name_ar AS organization_name_ar, org.name_en AS organization_name_en
    FROM opportunities o JOIN organizations org ON org.id = o.organization_id
    WHERE o.id = $1 LIMIT 1
  `, [id]);
  return result.rows[0] ? rowToOpportunity(result.rows[0]) : null;
}

export async function createOpportunity(input: {
  organizationId?: string;
  titleAr: string;
  titleEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  category: OpportunityCategory;
  city: string;
  startingPrice: number;
  estimatedReach: number;
  audience: string[];
  formats: string[];
}) {
  if (!databaseEnabled) {
    const created: Opportunity = {
      id: `opp-${randomUUID()}`,
      organizationId: input.organizationId ?? "org-demo-owner",
      organizationNameAr: "جهة تجريبية",
      organizationNameEn: "Demo Rights Holder",
      category: input.category,
      titleAr: input.titleAr,
      titleEn: input.titleEn,
      descriptionAr: input.descriptionAr ?? "",
      descriptionEn: input.descriptionEn ?? "",
      city: input.city,
      startingPrice: input.startingPrice,
      currency: "SAR",
      estimatedReach: input.estimatedReach,
      audience: input.audience,
      formats: input.formats,
      verified: false,
      trustScore: 55,
      availabilityScore: 90,
      performanceScore: 65
    };
    demoState.opportunities.unshift(created);
    return created;
  }

  const orgId = input.organizationId;
  if (!orgId) throw new Error("organizationId is required in production mode");
  const result = await query<any>(`
    INSERT INTO opportunities (
      organization_id, category, title_ar, title_en, description_ar, description_en, city,
      starting_price, estimated_reach, audience_json, format_json, status
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11::jsonb,'published')
    RETURNING *
  `, [orgId, input.category, input.titleAr, input.titleEn, input.descriptionAr ?? "", input.descriptionEn ?? "", input.city, input.startingPrice, input.estimatedReach, JSON.stringify(input.audience), JSON.stringify(input.formats)]);
  const org = await query<any>("SELECT name_ar,name_en FROM organizations WHERE id=$1", [orgId]);
  return rowToOpportunity({ ...result.rows[0], organization_name_ar: org.rows[0]?.name_ar, organization_name_en: org.rows[0]?.name_en ?? "Organization" });
}

export async function createCampaign(input: CampaignInput, organizationId?: string, userId?: string) {
  if (!databaseEnabled) {
    const item = { ...input, id: `camp-${randomUUID()}`, createdAt: new Date().toISOString(), status: "draft" };
    demoState.campaigns.unshift(item);
    return item;
  }
  if (!organizationId) throw new Error("organizationId is required");
  const result = await query<any>(`
    INSERT INTO campaigns (organization_id, owner_user_id, title, objective, target_audience, budget, starts_at, ends_at)
    VALUES ($1,$2,$3,$4,$5::jsonb,$6,NULL,NULL) RETURNING *
  `, [organizationId, userId ?? null, input.title, input.objective, JSON.stringify({ segments: input.audience ?? [], city: input.city, categories: input.categories ?? [] }), input.budget]);
  return result.rows[0];
}

export async function listDeals(orgId?: string, all = false): Promise<Deal[]> {
  if (!databaseEnabled) return demoState.deals;
  if (!orgId && !all) return [];
  const result = all
    ? await query<any>(`
      SELECT d.*, o.title_en, seller.name_en AS seller_name, buyer.name_en AS buyer_name
      FROM deals d
      JOIN opportunities o ON o.id=d.opportunity_id
      JOIN organizations seller ON seller.id=d.seller_org_id
      JOIN organizations buyer ON buyer.id=d.buyer_org_id
      ORDER BY d.updated_at DESC
    `)
    : await query<any>(`
      SELECT d.*, o.title_en, seller.name_en AS seller_name, buyer.name_en AS buyer_name
      FROM deals d
      JOIN opportunities o ON o.id=d.opportunity_id
      JOIN organizations seller ON seller.id=d.seller_org_id
      JOIN organizations buyer ON buyer.id=d.buyer_org_id
      WHERE d.buyer_org_id=$1 OR d.seller_org_id=$1
      ORDER BY d.updated_at DESC
    `, [orgId]);
  return result.rows.map((row: any) => ({
    id: row.id,
    opportunityId: row.opportunity_id,
    campaignId: row.campaign_id ?? undefined,
    buyerOrgId: row.buyer_org_id,
    sellerOrgId: row.seller_org_id,
    title: row.title_en,
    counterparty: all ? `${row.buyer_name} ↔ ${row.seller_name}` : row.buyer_org_id === orgId ? row.seller_name : row.buyer_name,
    amount: Number(row.agreed_amount ?? 0),
    currency: row.currency,
    stage: row.stage,
    updatedAt: row.updated_at
  }));
}

export async function createDeal(input: { opportunityId: string; campaignId?: string; buyerOrgId?: string; amount?: number }) {
  const opportunity = await getOpportunity(input.opportunityId);
  if (!opportunity) throw new Error("Opportunity not found");
  if (!databaseEnabled) {
    const deal: Deal = {
      id: `deal-${randomUUID()}`,
      opportunityId: opportunity.id,
      campaignId: input.campaignId,
      buyerOrgId: input.buyerOrgId ?? "org-demo-brand",
      sellerOrgId: opportunity.organizationId,
      title: opportunity.titleEn,
      counterparty: opportunity.organizationNameEn,
      amount: input.amount ?? opportunity.startingPrice,
      currency: "SAR",
      stage: "request",
      updatedAt: new Date().toISOString()
    };
    demoState.deals.unshift(deal);
    return deal;
  }
  if (!input.buyerOrgId) throw new Error("buyerOrgId is required");
  const result = await query<any>(`
    INSERT INTO deals (campaign_id,opportunity_id,buyer_org_id,seller_org_id,stage,agreed_amount)
    VALUES ($1,$2,$3,$4,'request',$5) RETURNING *
  `, [input.campaignId ?? null, input.opportunityId, input.buyerOrgId, opportunity.organizationId, input.amount ?? opportunity.startingPrice]);
  return result.rows[0];
}

export async function updateDealStage(id: string, stage: DealStage, actorOrgId?: string, isAdmin = false) {
  if (!databaseEnabled) {
    const deal = demoState.deals.find((x) => x.id === id);
    if (!deal) return null;
    deal.stage = stage;
    deal.updatedAt = new Date().toISOString();
    return deal;
  }
  if (!actorOrgId && !isAdmin) return null;
  const result = isAdmin
    ? await query<any>("UPDATE deals SET stage=$2,updated_at=now() WHERE id=$1 RETURNING *", [id, stage])
    : await query<any>("UPDATE deals SET stage=$2,updated_at=now() WHERE id=$1 AND (buyer_org_id=$3 OR seller_org_id=$3) RETURNING *", [id, stage, actorOrgId]);
  if (result.rows[0]) {
    await query("INSERT INTO deal_events (deal_id,event_type,payload) VALUES ($1,'stage_changed',$2::jsonb)", [id, JSON.stringify({ stage })]);
  }
  return result.rows[0] ?? null;
}

export async function authenticate(email: string, password: string): Promise<SessionUser | null> {
  if (!databaseEnabled) {
    if (email.toLowerCase() !== "demo@sponsorloop.sa" || password !== "Demo123!") return null;
    return { id: "user-demo", email, name: "Demo Advertiser", locale: "ar", role: "advertiser", organizationId: "org-demo-brand", organizationName: "Demo Brand" };
  }
  const result = await query<any>(`
    SELECT u.*, m.role, o.id AS organization_id, o.name_en AS organization_name
    FROM users u JOIN memberships m ON m.user_id=u.id JOIN organizations o ON o.id=m.organization_id
    WHERE LOWER(u.email)=LOWER($1) LIMIT 1
  `, [email]);
  const user = result.rows[0];
  if (!user?.password_hash || !(await bcrypt.compare(password, user.password_hash))) return null;
  return { id: user.id, email: user.email, name: user.display_name, locale: user.locale, role: user.role, organizationId: user.organization_id, organizationName: user.organization_name };
}

export async function listNotifications() {
  if (!databaseEnabled) return demoState.notifications;
  return [];
}

export async function markNotificationRead(id: string) {
  if (!databaseEnabled) {
    const n = demoState.notifications.find((x) => x.id === id);
    if (n) n.read = true;
    return n ?? null;
  }
  return null;
}

export async function listDealMessages(dealId: string) {
  if (!databaseEnabled) return demoState.messages.filter((x) => x.dealId === dealId);
  return [];
}

export async function addDealMessage(input: { dealId: string; senderName: string; senderRole: "buyer" | "seller" | "system"; message: string }) {
  if (!databaseEnabled) {
    const msg = { ...input, id: `msg-${Date.now()}`, createdAt: new Date().toISOString() };
    demoState.messages.unshift(msg);
    return msg;
  }
  return null;
}

export async function listReviews(dealId?: string) {
  if (!databaseEnabled) return dealId ? demoState.reviews.filter((x) => x.dealId === dealId) : demoState.reviews;
  return [];
}

export async function addReview(input: { dealId: string; rating: number; comment: string; reviewerName: string }) {
  if (!databaseEnabled) {
    const rev = { ...input, id: `rev-${Date.now()}`, createdAt: new Date().toISOString() };
    demoState.reviews.push(rev);
    return rev;
  }
  return null;
}

export async function getFavorites() {
  if (!databaseEnabled) return demoState.favorites;
  return [];
}

export async function toggleFavorite(opportunityId: string) {
  if (!databaseEnabled) {
    const idx = demoState.favorites.indexOf(opportunityId);
    if (idx >= 0) demoState.favorites.splice(idx, 1);
    else demoState.favorites.push(opportunityId);
    return demoState.favorites;
  }
  return [];
}

export async function listSponsorshipRequests(filters?: { category?: string; city?: string }): Promise<SponsorshipRequest[]> {
  if (!databaseEnabled) {
    let data = demoState.sponsorshipRequests;
    if (filters?.category && filters.category !== "all") data = data.filter((x) => x.category === filters.category);
    if (filters?.city && filters.city !== "all") data = data.filter((x) => x.city.toLowerCase() === filters.city!.toLowerCase());
    return data;
  }
  return [];
}

export async function createSponsorshipRequest(input: {
  organizationNameAr: string;
  organizationNameEn: string;
  category: OpportunityCategory;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  city: string;
  budgetRange: string;
  audienceSize: number;
}): Promise<SponsorshipRequest> {
  const request: SponsorshipRequest = {
    ...input,
    id: `req-${randomUUID()}`,
    status: "open",
    createdAt: new Date().toISOString()
  };
  if (!databaseEnabled) {
    demoState.sponsorshipRequests.unshift(request);
  }
  return request;
}

export async function register(input: { email: string; password: string; name: string; organizationName: string; role: SessionUser["role"] }): Promise<SessionUser> {
  if (!databaseEnabled) {
    return { id: `user-${randomUUID()}`, email: input.email, name: input.name, locale: "ar", role: input.role, organizationId: `org-${randomUUID()}`, organizationName: input.organizationName };
  }
  if (!pool) throw new Error("Database unavailable");
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const org = await client.query<any>("INSERT INTO organizations (name_en,name_ar,org_type) VALUES ($1,$1,$2) RETURNING id,name_en", [input.organizationName, input.role === "owner" ? "rights_holder" : input.role === "agency" ? "agency" : "brand"]);
    const hash = await bcrypt.hash(input.password, 12);
    const user = await client.query<any>("INSERT INTO users (email,display_name,locale,password_hash) VALUES ($1,$2,'ar',$3) RETURNING id,email,display_name,locale", [input.email.toLowerCase(), input.name, hash]);
    await client.query("INSERT INTO memberships (organization_id,user_id,role) VALUES ($1,$2,$3)", [org.rows[0].id, user.rows[0].id, input.role]);
    await client.query("COMMIT");
    return { id: user.rows[0].id, email: user.rows[0].email, name: user.rows[0].display_name, locale: "ar", role: input.role, organizationId: org.rows[0].id, organizationName: org.rows[0].name_en };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
