import { NextResponse } from "next/server";
import { addReview, listReviews } from "@/lib/repository";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const items = await listReviews(id);
  return NextResponse.json({ data: items });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { rating, comment, reviewerName } = await request.json();
  if (!rating || !comment) return NextResponse.json({ error: "rating and comment required" }, { status: 400 });
  const result = await addReview({ dealId: id, rating, comment, reviewerName: reviewerName ?? "Demo User" });
  return NextResponse.json({ data: result });
}
