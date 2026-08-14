import { NextResponse } from "next/server";
import { z } from "zod";
import { createCampaign } from "@/lib/repository";
import { getSession } from "@/lib/session";
import { databaseEnabled } from "@/lib/db";

const schema = z.object({ title: z.string().min(3), objective: z.string().min(2), budget: z.number().positive(), city: z.string().optional(), categories: z.array(z.enum(["events", "creators", "podcasts", "sports", "digital", "ooh", "community", "gaming"])).optional(), audience: z.array(z.string()).optional() });
export async function POST(request: Request) {
  const user = await getSession();
  if (databaseEnabled && !user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  if (databaseEnabled && user && !["advertiser","agency","admin"].includes(user.role)) return NextResponse.json({ error: "Advertiser or agency role required" }, { status: 403 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid campaign", details: parsed.error.flatten() }, { status: 400 });
  try { return NextResponse.json({ data: await createCampaign(parsed.data, user?.organizationId, user?.id) }, { status: 201 }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Create failed" }, { status: 500 }); }
}
