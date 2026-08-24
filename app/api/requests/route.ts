import { NextResponse } from "next/server";
import { listSponsorshipRequests, createSponsorshipRequest } from "@/lib/repository";
import { getSession } from "@/lib/session";
import { databaseEnabled } from "@/lib/db";

export async function GET() {
  const data = await listSponsorshipRequests();
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const user=await getSession(); if(databaseEnabled&&!user) return NextResponse.json({error:"Authentication required"},{status:401});
  const body = await req.json();
  const { organizationNameAr, organizationNameEn, titleAr, titleEn, descriptionAr, descriptionEn, category, city, budgetRange, audienceSize } = body;
  if (!titleAr || !titleEn || !organizationNameEn) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const data = await createSponsorshipRequest({
    organizationNameAr: organizationNameAr || organizationNameEn,
    organizationNameEn,
    category: category || "events",
    titleAr,
    titleEn,
    descriptionAr: descriptionAr || "",
    descriptionEn: descriptionEn || "",
    city: city || "Riyadh",
    budgetRange: budgetRange || "10K–50K SAR",
    audienceSize: Number(audienceSize) || 10000,
    organizationId:user?.organizationId
  });
  return NextResponse.json({ data }, { status: 201 });
}
