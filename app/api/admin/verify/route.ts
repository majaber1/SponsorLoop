import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { verifyOpportunity } from "@/lib/repository";
import { databaseEnabled } from "@/lib/db";

const schema = z.object({
  opportunityId: z.string().min(1),
  approved: z.boolean()
});

export async function POST(request: Request) {
  const session = await getSession();
  if (databaseEnabled && session?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const result = await verifyOpportunity(parsed.data.opportunityId, parsed.data.approved);
  if (!result) return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
  return NextResponse.json({ data: result, action: parsed.data.approved ? "approved" : "rejected" });
}
