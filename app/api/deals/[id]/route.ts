import { NextResponse } from "next/server";
import { z } from "zod";
import { updateDealStage } from "@/lib/repository";
import { getSession } from "@/lib/session";
import { databaseEnabled } from "@/lib/db";
const schema = z.object({ stage: z.enum(["inquiry","offer_submitted","rights_holder_review","negotiation","internal_approval","contract_draft","seller_approved","buyer_approved","signature_pending","signed","funding_pending","funded","activation_planning","creative_review","live","evidence_submitted","milestone_approved","settlement_pending","settled","performance_reporting","completed"]) });
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (databaseEnabled && !user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const { id } = await context.params; const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
  const data = await updateDealStage(id, parsed.data.stage, user?.organizationId, user?.role === "admin");
  if (!data) return NextResponse.json({ error: "Not found or not authorized" }, { status: 404 });
  return NextResponse.json({ data });
}
