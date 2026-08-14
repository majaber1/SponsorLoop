import { NextResponse } from "next/server";
import { z } from "zod";
import { createDeal, listDeals } from "@/lib/repository";
import { getSession } from "@/lib/session";
import { databaseEnabled } from "@/lib/db";

const schema = z.object({ opportunityId: z.string().min(1), campaignId: z.string().optional(), amount: z.number().positive().optional() });
export async function GET() {
  const user = await getSession();
  if (databaseEnabled && !user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  return NextResponse.json({ data: await listDeals(user?.organizationId, user?.role === "admin") });
}
export async function POST(request: Request) {
  const user = await getSession();
  if (databaseEnabled && !user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  if (databaseEnabled && user && !["advertiser","agency","admin"].includes(user.role)) return NextResponse.json({ error: "Buyer role required" }, { status: 403 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid deal" }, { status: 400 });
  try { return NextResponse.json({ data: await createDeal({ ...parsed.data, buyerOrgId: user?.organizationId }) }, { status: 201 }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Create failed" }, { status: 500 }); }
}
