import { NextResponse } from "next/server";
import { getFavorites, toggleFavorite } from "@/lib/repository";

export async function GET() {
  const items = await getFavorites();
  return NextResponse.json({ data: items });
}

export async function POST(request: Request) {
  const { opportunityId } = await request.json();
  if (!opportunityId) return NextResponse.json({ error: "opportunityId required" }, { status: 400 });
  const result = await toggleFavorite(opportunityId);
  return NextResponse.json({ data: result });
}
