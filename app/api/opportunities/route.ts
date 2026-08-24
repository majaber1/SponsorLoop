import { NextResponse } from "next/server";
import { z } from "zod";
import { createOpportunity, listOpportunities } from "@/lib/repository";
import { getSession } from "@/lib/session";
import { databaseEnabled } from "@/lib/db";

const category = z.enum(["events", "creators", "podcasts", "sports", "digital", "ooh", "community", "gaming", "athletes", "hackathons", "clubs"]);
const createSchema = z.object({
  titleAr: z.string().min(3), titleEn: z.string().min(3), descriptionAr: z.string().optional(), descriptionEn: z.string().optional(), category,
  city: z.string().min(2), startingPrice: z.number().positive(), estimatedReach: z.number().nonnegative(), audience: z.array(z.string()).default([]), formats: z.array(z.string()).default([])
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const data = await listOpportunities({ category: url.searchParams.get("category") ?? undefined, city: url.searchParams.get("city") ?? undefined, q: url.searchParams.get("q") ?? undefined });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const user = await getSession();
  if (databaseEnabled && !user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  if (databaseEnabled && user && !["owner","agency","admin"].includes(user.role)) return NextResponse.json({ error: "Rights-holder or agency role required" }, { status: 403 });
  const parsed = createSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid opportunity", details: parsed.error.flatten() }, { status: 400 });
  try {
    const data = await createOpportunity({ ...parsed.data, organizationId: user?.organizationId });
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Create failed" }, { status: 500 });
  }
}
