import { NextResponse } from "next/server";
import { getOrganizationProfile } from "@/lib/repository";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const org = await getOrganizationProfile(id);
  if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(org);
}
