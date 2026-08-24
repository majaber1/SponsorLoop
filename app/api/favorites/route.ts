import { NextResponse } from "next/server";
import { getFavorites, toggleFavorite } from "@/lib/repository";
import { getSession } from "@/lib/session";

export async function GET() {
  const user=await getSession(); if(!user) return NextResponse.json({error:"Authentication required"},{status:401});
  const items = await getFavorites(user.id);
  return NextResponse.json({ data: items });
}

export async function POST(request: Request) {
  const user=await getSession(); if(!user) return NextResponse.json({error:"Authentication required"},{status:401});
  const { opportunityId } = await request.json();
  if (!opportunityId) return NextResponse.json({ error: "opportunityId required" }, { status: 400 });
  const result = await toggleFavorite(opportunityId,user.id);
  return NextResponse.json({ data: result });
}
