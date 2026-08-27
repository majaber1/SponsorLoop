import { NextResponse } from "next/server";
import { z } from "zod";
import { databaseEnabled } from "@/lib/db";
import { getSession } from "@/lib/session";
import {
  createGrowthLead,
  createOutreachDraft,
  getGrowthDashboard,
  updateGrowthLead,
  updateOutreach,
  type GrowthLeadStatus,
  type OutreachStatus,
} from "@/lib/growth-engine";

async function requireAdmin() {
  const session = await getSession();
  if (databaseEnabled && session?.role !== "admin") return null;
  return session;
}

const leadSchema = z.object({
  action: z.literal("createLead"),
  side: z.enum(["creator", "brand"]),
  name: z.string().min(2).max(120),
  handle: z.string().max(120).optional(),
  platform: z.enum(["tiktok", "instagram", "youtube", "linkedin", "other"]),
  profileUrl: z.string().url().optional(),
  source: z.enum(["tiktok_one", "tiktok_business_api", "manual", "csv", "referral", "platform"]).default("manual"),
  city: z.string().max(80).optional(),
  categories: z.array(z.string().min(1).max(60)).max(12).default([]),
  audience: z.array(z.string().min(1).max(60)).max(12).default([]),
  followers: z.number().int().nonnegative().default(0),
  avgViews: z.number().int().nonnegative().default(0),
  engagementRate: z.number().nonnegative().max(100).default(0),
  rateMin: z.number().nonnegative().default(0),
  rateMax: z.number().nonnegative().default(0),
  budgetMin: z.number().nonnegative().default(0),
  budgetMax: z.number().nonnegative().default(0),
  mawthooqStatus: z.enum(["unknown", "verified", "not_required", "failed"]).default("unknown"),
  mawthooqReference: z.string().max(160).optional(),
  notes: z.string().max(1000).optional(),
});

const updateLeadSchema = z.object({
  action: z.literal("updateLead"),
  id: z.string().uuid(),
  status: z.enum(["discovered", "qualified", "invited", "joined", "paused", "rejected"]).optional(),
  mawthooqStatus: z.enum(["unknown", "verified", "not_required", "failed"]).optional(),
  mawthooqReference: z.string().max(160).optional(),
  notes: z.string().max(1000).optional(),
});

const draftSchema = z.object({
  action: z.literal("draftOutreach"),
  leadId: z.string().uuid(),
  channel: z.enum(["tiktok", "email", "whatsapp", "linkedin", "manual"]).default("manual"),
});

const outreachSchema = z.object({
  action: z.literal("updateOutreach"),
  id: z.string().uuid(),
  status: z.enum(["approved", "sent", "replied", "joined", "declined", "failed"]),
});

const bodySchema = z.discriminatedUnion("action", [leadSchema, updateLeadSchema, draftSchema, outreachSchema]);

export async function GET() {
  const session = await requireAdmin();
  if (databaseEnabled && !session) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  return NextResponse.json(await getGrowthDashboard(), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (databaseEnabled && !session) return NextResponse.json({ error: "Admin access required" }, { status: 403 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid growth action", details: parsed.error.flatten() }, { status: 400 });

  try {
    const input = parsed.data;
    if (input.action === "createLead") {
      const { action: _action, ...lead } = input;
      await createGrowthLead(lead);
    } else if (input.action === "updateLead") {
      const patch: { status?: GrowthLeadStatus; mawthooqStatus?: "unknown" | "verified" | "not_required" | "failed"; mawthooqReference?: string; notes?: string } = {};
      if (input.status) patch.status = input.status;
      if (input.mawthooqStatus) patch.mawthooqStatus = input.mawthooqStatus;
      if (input.mawthooqReference !== undefined) patch.mawthooqReference = input.mawthooqReference;
      if (input.notes !== undefined) patch.notes = input.notes;
      await updateGrowthLead(input.id, patch);
    } else if (input.action === "draftOutreach") {
      await createOutreachDraft(input.leadId, input.channel);
    } else if (input.action === "updateOutreach") {
      await updateOutreach(input.id, input.status as OutreachStatus, session?.id);
      if (input.status === "joined") {
        const dashboard = await getGrowthDashboard();
        const item = dashboard.outreach.find((x) => x.id === input.id);
        if (item) await updateGrowthLead(item.leadId, { status: "joined" });
      }
    }
    return NextResponse.json(await getGrowthDashboard(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Growth action failed" }, { status: 500 });
  }
}
