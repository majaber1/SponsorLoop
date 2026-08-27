import { randomUUID } from "node:crypto";
import { databaseEnabled, query } from "./db";

export type GrowthSide = "creator" | "brand";
export type GrowthLeadStatus = "discovered" | "qualified" | "invited" | "joined" | "paused" | "rejected";
export type OutreachStatus = "draft" | "approved" | "sent" | "replied" | "joined" | "declined" | "failed";
export type MawthooqStatus = "unknown" | "verified" | "not_required" | "failed";
export type GrowthSource = "tiktok_one" | "tiktok_business_api" | "manual" | "csv" | "referral" | "platform";

export type GrowthLead = {
  id: string;
  side: GrowthSide;
  name: string;
  handle?: string;
  platform: "tiktok" | "instagram" | "youtube" | "linkedin" | "other";
  profileUrl?: string;
  source: GrowthSource;
  city?: string;
  categories: string[];
  audience: string[];
  followers: number;
  avgViews: number;
  engagementRate: number;
  rateMin: number;
  rateMax: number;
  budgetMin: number;
  budgetMax: number;
  mawthooqStatus: MawthooqStatus;
  mawthooqReference?: string;
  status: GrowthLeadStatus;
  qualificationScore: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type GrowthOutreach = {
  id: string;
  leadId: string;
  leadName: string;
  side: GrowthSide;
  channel: "tiktok" | "email" | "whatsapp" | "linkedin" | "manual";
  status: OutreachStatus;
  messageAr: string;
  messageEn: string;
  createdAt: string;
  approvedAt?: string;
  sentAt?: string;
};

export type GrowthMatch = {
  id: string;
  brandLeadId: string;
  brandName: string;
  creatorLeadId: string;
  creatorName: string;
  score: number;
  suggestedBudget: number;
  reasonsAr: string[];
  reasonsEn: string[];
};

export type GrowthDashboard = {
  leads: GrowthLead[];
  outreach: GrowthOutreach[];
  matches: GrowthMatch[];
  funnel: Record<GrowthLeadStatus, number>;
  connectors: {
    tiktokDiscovery: "connected" | "gated";
    tiktokMessaging: "connected" | "gated";
    aiCopy: "connected" | "fallback";
    mawthooq: "manual_verification";
    autoSend: "enabled" | "disabled";
  };
  agents: Array<{ id: string; name: string; status: "ready" | "gated" | "manual"; purpose: string }>;
};

const globalGrowth = globalThis as unknown as { sponsorLoopGrowthDemo?: { leads: GrowthLead[]; outreach: GrowthOutreach[] } };

const now = () => new Date().toISOString();

function seedDemoLeads(): GrowthLead[] {
  const createdAt = now();
  const raw: Array<Omit<GrowthLead, "id" | "qualificationScore" | "status" | "createdAt" | "updatedAt">> = [
    {
      side: "creator", name: "Riyadh Food Creator", handle: "@demo_food_riyadh", platform: "tiktok", source: "manual", city: "Riyadh",
      categories: ["food", "restaurants", "lifestyle"], audience: ["18-34", "riyadh", "foodies"], followers: 42000, avgViews: 18500, engagementRate: 6.2,
      rateMin: 450, rateMax: 900, budgetMin: 0, budgetMax: 0, mawthooqStatus: "unknown", notes: "Demo lead — replace with official TikTok One/API data."
    },
    {
      side: "creator", name: "Saudi Gaming Creator", handle: "@demo_gaming_sa", platform: "tiktok", source: "manual", city: "Jeddah",
      categories: ["gaming", "technology"], audience: ["18-30", "gamers", "saudi"], followers: 88000, avgViews: 36000, engagementRate: 7.1,
      rateMin: 800, rateMax: 1500, budgetMin: 0, budgetMax: 0, mawthooqStatus: "verified", mawthooqReference: "DEMO-VERIFY", notes: "Demo lead."
    },
    {
      side: "brand", name: "Local Coffee Brand", handle: "@demo_coffee_brand", platform: "tiktok", source: "manual", city: "Riyadh",
      categories: ["food", "coffee", "lifestyle"], audience: ["18-34", "riyadh"], followers: 12000, avgViews: 5000, engagementRate: 3.1,
      rateMin: 0, rateMax: 0, budgetMin: 400, budgetMax: 700, mawthooqStatus: "not_required", notes: "Demo demand lead."
    },
    {
      side: "brand", name: "Gaming Accessories Brand", handle: "@demo_gaming_brand", platform: "tiktok", source: "manual", city: "Riyadh",
      categories: ["gaming", "technology"], audience: ["18-30", "gamers"], followers: 26000, avgViews: 9200, engagementRate: 3.8,
      rateMin: 0, rateMax: 0, budgetMin: 1000, budgetMax: 1800, mawthooqStatus: "not_required", notes: "Demo demand lead."
    }
  ];
  return raw.map((item) => {
    const lead = { ...item, id: randomUUID(), status: "discovered" as GrowthLeadStatus, qualificationScore: 0, createdAt, updatedAt: createdAt };
    lead.qualificationScore = scoreLead(lead);
    lead.status = lead.qualificationScore >= 70 ? "qualified" : "discovered";
    return lead;
  });
}

function demoStore() {
  if (!globalGrowth.sponsorLoopGrowthDemo) globalGrowth.sponsorLoopGrowthDemo = { leads: seedDemoLeads(), outreach: [] };
  return globalGrowth.sponsorLoopGrowthDemo;
}

const schema = [
  `CREATE TABLE IF NOT EXISTS growth_leads(
    id uuid PRIMARY KEY,
    side text NOT NULL CHECK(side IN ('creator','brand')),
    name text NOT NULL,
    handle text,
    platform text NOT NULL,
    profile_url text,
    source text NOT NULL,
    city text,
    categories jsonb NOT NULL DEFAULT '[]',
    audience jsonb NOT NULL DEFAULT '[]',
    followers integer NOT NULL DEFAULT 0,
    avg_views integer NOT NULL DEFAULT 0,
    engagement_rate numeric NOT NULL DEFAULT 0,
    rate_min numeric NOT NULL DEFAULT 0,
    rate_max numeric NOT NULL DEFAULT 0,
    budget_min numeric NOT NULL DEFAULT 0,
    budget_max numeric NOT NULL DEFAULT 0,
    mawthooq_status text NOT NULL DEFAULT 'unknown',
    mawthooq_reference text,
    status text NOT NULL DEFAULT 'discovered',
    qualification_score integer NOT NULL DEFAULT 0,
    notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS growth_outreach(
    id uuid PRIMARY KEY,
    lead_id uuid NOT NULL REFERENCES growth_leads(id) ON DELETE CASCADE,
    channel text NOT NULL,
    status text NOT NULL DEFAULT 'draft',
    message_ar text NOT NULL,
    message_en text NOT NULL,
    approved_by uuid REFERENCES users(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    approved_at timestamptz,
    sent_at timestamptz
  )`,
  `CREATE INDEX IF NOT EXISTS idx_growth_leads_side_status ON growth_leads(side,status)`,
  `CREATE INDEX IF NOT EXISTS idx_growth_outreach_status ON growth_outreach(status)`
];

export async function ensureGrowthEngine() {
  if (!databaseEnabled) return;
  for (const statement of schema) await query(statement);
}

export function scoreLead(lead: Pick<GrowthLead, "side" | "followers" | "avgViews" | "engagementRate" | "rateMin" | "rateMax" | "budgetMin" | "budgetMax" | "categories" | "mawthooqStatus">) {
  const activity = Math.min(100, (lead.avgViews / Math.max(1000, lead.followers * 0.25)) * 100);
  const engagement = Math.min(100, lead.engagementRate * 12);
  const categoryQuality = lead.categories.length ? Math.min(100, 60 + lead.categories.length * 10) : 35;
  const commercial = lead.side === "creator"
    ? (lead.rateMax > 0 && lead.rateMax >= lead.rateMin ? 90 : 45)
    : (lead.budgetMax > 0 && lead.budgetMax >= lead.budgetMin ? 90 : 45);
  const compliance = lead.side === "brand" ? 88 : lead.mawthooqStatus === "verified" ? 100 : lead.mawthooqStatus === "failed" ? 0 : 55;
  return Math.round(activity * 0.2 + engagement * 0.2 + categoryQuality * 0.2 + commercial * 0.2 + compliance * 0.2);
}

function rowToLead(row: any): GrowthLead {
  return {
    id: row.id, side: row.side, name: row.name, handle: row.handle ?? undefined, platform: row.platform, profileUrl: row.profile_url ?? undefined,
    source: row.source, city: row.city ?? undefined, categories: Array.isArray(row.categories) ? row.categories : [], audience: Array.isArray(row.audience) ? row.audience : [],
    followers: Number(row.followers ?? 0), avgViews: Number(row.avg_views ?? 0), engagementRate: Number(row.engagement_rate ?? 0),
    rateMin: Number(row.rate_min ?? 0), rateMax: Number(row.rate_max ?? 0), budgetMin: Number(row.budget_min ?? 0), budgetMax: Number(row.budget_max ?? 0),
    mawthooqStatus: row.mawthooq_status, mawthooqReference: row.mawthooq_reference ?? undefined, status: row.status,
    qualificationScore: Number(row.qualification_score ?? 0), notes: row.notes ?? undefined,
    createdAt: new Date(row.created_at).toISOString(), updatedAt: new Date(row.updated_at).toISOString()
  };
}

export async function listGrowthLeads(): Promise<GrowthLead[]> {
  if (!databaseEnabled) return demoStore().leads;
  await ensureGrowthEngine();
  const result = await query<any>("SELECT * FROM growth_leads ORDER BY qualification_score DESC, created_at DESC LIMIT 300");
  return result.rows.map(rowToLead);
}

export async function createGrowthLead(input: Omit<GrowthLead, "id" | "status" | "qualificationScore" | "createdAt" | "updatedAt">) {
  const base = { ...input, id: randomUUID(), status: "discovered" as GrowthLeadStatus, qualificationScore: 0, createdAt: now(), updatedAt: now() };
  base.qualificationScore = scoreLead(base);
  base.status = base.qualificationScore >= 70 ? "qualified" : "discovered";
  if (!databaseEnabled) {
    demoStore().leads.unshift(base);
    return base;
  }
  await ensureGrowthEngine();
  await query(`INSERT INTO growth_leads(
    id,side,name,handle,platform,profile_url,source,city,categories,audience,followers,avg_views,engagement_rate,rate_min,rate_max,budget_min,budget_max,mawthooq_status,mawthooq_reference,status,qualification_score,notes
  ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)`, [
    base.id,base.side,base.name,base.handle ?? null,base.platform,base.profileUrl ?? null,base.source,base.city ?? null,JSON.stringify(base.categories),JSON.stringify(base.audience),base.followers,base.avgViews,base.engagementRate,base.rateMin,base.rateMax,base.budgetMin,base.budgetMax,base.mawthooqStatus,base.mawthooqReference ?? null,base.status,base.qualificationScore,base.notes ?? null
  ]);
  return base;
}

export async function updateGrowthLead(id: string, patch: Partial<Pick<GrowthLead, "status" | "mawthooqStatus" | "mawthooqReference" | "notes">>) {
  if (!databaseEnabled) {
    const lead = demoStore().leads.find((x) => x.id === id);
    if (!lead) return null;
    Object.assign(lead, patch, { updatedAt: now() });
    lead.qualificationScore = scoreLead(lead);
    return lead;
  }
  await ensureGrowthEngine();
  const current = await query<any>("SELECT * FROM growth_leads WHERE id=$1", [id]);
  if (!current.rows[0]) return null;
  const lead = rowToLead(current.rows[0]);
  Object.assign(lead, patch);
  lead.qualificationScore = scoreLead(lead);
  const result = await query<any>(`UPDATE growth_leads SET status=$2,mawthooq_status=$3,mawthooq_reference=$4,notes=$5,qualification_score=$6,updated_at=now() WHERE id=$1 RETURNING *`, [
    id, lead.status, lead.mawthooqStatus, lead.mawthooqReference ?? null, lead.notes ?? null, lead.qualificationScore
  ]);
  return rowToLead(result.rows[0]);
}

export function draftOutreachCopy(lead: GrowthLead) {
  if (lead.side === "creator") {
    return {
      ar: `مرحبًا ${lead.name}، نحن SponsorLoop، منصة تربط صناع المحتوى بفرص رعاية مناسبة لجمهورهم. لاحظنا أن محتواك في ${lead.categories.slice(0,2).join(" و ") || "مجالك"} قد يناسب حملات لدينا. التسجيل مجاني، وبعد انضمامك نقترح عليك فرصًا حسب جمهورك وسعرك بدون التزام.`,
      en: `Hi ${lead.name}, we are SponsorLoop, a platform matching creators with relevant sponsorship opportunities. Your ${lead.categories.slice(0,2).join(" / ") || "content"} profile may fit active briefs on the platform. Joining is free, and we recommend opportunities based on your audience and rates with no obligation.`
    };
  }
  return {
    ar: `مرحبًا ${lead.name}، SponsorLoop يساعد العلامات التجارية على إيجاد صناع محتوى وفرص رعاية ضمن ميزانية واضحة وقياس واحد. يمكنكم تحديد ميزانية الحملة والجمهور المطلوب، ونقترح عليكم أفضل الخيارات بدل البحث اليدوي.`,
    en: `Hi ${lead.name}, SponsorLoop helps brands discover creators and sponsorship inventory within a clear budget and one measurable workflow. Set your campaign budget and audience, and the platform recommends the strongest fits instead of manual searching.`
  };
}

export async function createOutreachDraft(leadId: string, channel: GrowthOutreach["channel"] = "manual") {
  const leads = await listGrowthLeads();
  const lead = leads.find((x) => x.id === leadId);
  if (!lead) throw new Error("Lead not found");
  const copy = draftOutreachCopy(lead);
  const item: GrowthOutreach = { id: randomUUID(), leadId, leadName: lead.name, side: lead.side, channel, status: "draft", messageAr: copy.ar, messageEn: copy.en, createdAt: now() };
  if (!databaseEnabled) {
    demoStore().outreach.unshift(item);
    return item;
  }
  await ensureGrowthEngine();
  await query("INSERT INTO growth_outreach(id,lead_id,channel,status,message_ar,message_en) VALUES($1,$2,$3,'draft',$4,$5)", [item.id, leadId, channel, item.messageAr, item.messageEn]);
  return item;
}

export async function updateOutreach(id: string, status: OutreachStatus, approvedBy?: string) {
  if (!databaseEnabled) {
    const item = demoStore().outreach.find((x) => x.id === id);
    if (!item) return null;
    item.status = status;
    if (status === "approved") item.approvedAt = now();
    if (status === "sent") item.sentAt = now();
    return item;
  }
  await ensureGrowthEngine();
  const approvedAt = status === "approved" ? "now()" : "approved_at";
  const sentAt = status === "sent" ? "now()" : "sent_at";
  const result = await query<any>(`UPDATE growth_outreach SET status=$2,approved_by=CASE WHEN $2='approved' THEN $3::uuid ELSE approved_by END,approved_at=${approvedAt},sent_at=${sentAt} WHERE id=$1 RETURNING *`, [id, status, approvedBy ?? null]);
  return result.rows[0] ?? null;
}

export async function listGrowthOutreach(): Promise<GrowthOutreach[]> {
  if (!databaseEnabled) return demoStore().outreach;
  await ensureGrowthEngine();
  const result = await query<any>(`SELECT go.*,gl.name AS lead_name,gl.side FROM growth_outreach go JOIN growth_leads gl ON gl.id=go.lead_id ORDER BY go.created_at DESC LIMIT 200`);
  return result.rows.map((row: any) => ({
    id: row.id, leadId: row.lead_id, leadName: row.lead_name, side: row.side, channel: row.channel, status: row.status,
    messageAr: row.message_ar, messageEn: row.message_en, createdAt: new Date(row.created_at).toISOString(),
    approvedAt: row.approved_at ? new Date(row.approved_at).toISOString() : undefined, sentAt: row.sent_at ? new Date(row.sent_at).toISOString() : undefined
  }));
}

function overlap(a: string[], b: string[]) {
  if (!a.length || !b.length) return 50;
  const left = a.map((x) => x.toLowerCase());
  const hits = b.filter((x) => left.includes(x.toLowerCase())).length;
  return Math.min(100, 35 + (hits / Math.max(a.length, b.length)) * 100);
}

function budgetMatch(brand: GrowthLead, creator: GrowthLead) {
  const bMin = brand.budgetMin || 0, bMax = brand.budgetMax || 0, cMin = creator.rateMin || 0, cMax = creator.rateMax || 0;
  if (!bMax || !cMax) return 40;
  if (Math.max(bMin, cMin) <= Math.min(bMax, cMax)) return 100;
  if (cMin <= bMax * 1.25) return 70;
  if (cMin <= bMax * 1.6) return 35;
  return 5;
}

export function buildGrowthMatches(leads: GrowthLead[]): GrowthMatch[] {
  const brands = leads.filter((x) => x.side === "brand" && !["rejected","paused"].includes(x.status));
  const creators = leads.filter((x) => x.side === "creator" && !["rejected","paused"].includes(x.status));
  const matches: GrowthMatch[] = [];
  for (const brand of brands) for (const creator of creators) {
    const category = overlap(brand.categories, creator.categories);
    const audience = overlap(brand.audience, creator.audience);
    const budget = budgetMatch(brand, creator);
    const geography = !brand.city || !creator.city ? 70 : brand.city.toLowerCase() === creator.city.toLowerCase() ? 100 : 62;
    const compliance = creator.mawthooqStatus === "verified" ? 100 : creator.mawthooqStatus === "failed" ? 0 : 55;
    const quality = creator.qualificationScore;
    const score = Math.round(category * 0.25 + audience * 0.2 + budget * 0.25 + geography * 0.1 + compliance * 0.1 + quality * 0.1);
    const suggestedBudget = Math.round(Math.min(brand.budgetMax || creator.rateMax, Math.max(creator.rateMin, (creator.rateMin + creator.rateMax) / 2 || brand.budgetMin)));
    matches.push({
      id: `${brand.id}:${creator.id}`, brandLeadId: brand.id, brandName: brand.name, creatorLeadId: creator.id, creatorName: creator.name,
      score, suggestedBudget,
      reasonsAr: [budget >= 90 ? "تطابق مباشر مع الميزانية" : "يحتاج تفاوض على الحزمة", category >= 75 ? "تطابق قوي في القطاع" : "تطابق قطاعي متوسط", compliance === 100 ? "حالة موثوق مسجلة كمتحقق منها" : "يلزم التحقق من متطلبات موثوق قبل التفعيل"],
      reasonsEn: [budget >= 90 ? "Direct budget fit" : "Package negotiation required", category >= 75 ? "Strong category fit" : "Moderate category fit", compliance === 100 ? "Mawthooq recorded as verified" : "Mawthooq/compliance verification required before activation"]
    });
  }
  return matches.sort((a,b) => b.score - a.score).slice(0,50);
}

export async function getGrowthDashboard(): Promise<GrowthDashboard> {
  const [leads, outreach] = await Promise.all([listGrowthLeads(), listGrowthOutreach()]);
  const funnel: GrowthDashboard["funnel"] = { discovered: 0, qualified: 0, invited: 0, joined: 0, paused: 0, rejected: 0 };
  for (const lead of leads) funnel[lead.status]++;
  const discoveryConnected = Boolean(process.env.TIKTOK_API_FOR_BUSINESS_ACCESS_TOKEN && process.env.TIKTOK_BUSINESS_ID);
  const messagingConnected = discoveryConnected && process.env.TIKTOK_BUSINESS_MESSAGING_ENABLED === "true";
  const autoSend = messagingConnected && process.env.GROWTH_AUTOSEND_ENABLED === "true";
  return {
    leads,
    outreach,
    matches: buildGrowthMatches(leads),
    funnel,
    connectors: {
      tiktokDiscovery: discoveryConnected ? "connected" : "gated",
      tiktokMessaging: messagingConnected ? "connected" : "gated",
      aiCopy: process.env.OPENAI_API_KEY ? "connected" : "fallback",
      mawthooq: "manual_verification",
      autoSend: autoSend ? "enabled" : "disabled"
    },
    agents: [
      { id: "creator-scout", name: "Creator Scout", status: discoveryConnected ? "ready" : "gated", purpose: "Discover and rank active creators using approved sources." },
      { id: "brand-scout", name: "Brand Scout", status: "manual", purpose: "Qualify sponsors by category, geography and declared campaign budget." },
      { id: "outreach", name: "Outreach Copilot", status: "ready", purpose: "Draft personalized invitations; human approval remains required before sending." },
      { id: "matchmaker", name: "Matchmaker", status: "ready", purpose: "Rank creator-brand pairs by budget, audience, category, geography and compliance." },
      { id: "compliance", name: "Compliance Gate", status: "manual", purpose: "Verify Mawthooq/electronic-ad disclosure requirements before activation." }
    ]
  };
}
