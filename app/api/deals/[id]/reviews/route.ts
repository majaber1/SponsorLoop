import { NextResponse } from "next/server";
import { addReview, listReviews } from "@/lib/repository";
import { getSession } from "@/lib/session";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user=await getSession(); if(!user) return NextResponse.json({error:"Authentication required"},{status:401});
  const items = await listReviews(id,user.organizationId,user.role==="admin");
  return NextResponse.json({ data: items });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user=await getSession(); if(!user) return NextResponse.json({error:"Authentication required"},{status:401});
  const { rating, comment, reviewerName } = await request.json();
  if (!rating || !comment) return NextResponse.json({ error: "rating and comment required" }, { status: 400 });
  const result = await addReview({ dealId:id,rating:Number(rating),comment,reviewerName:user.name,reviewerUserId:user.id,actorOrgId:user.organizationId,isAdmin:user.role==="admin" });
  return result?NextResponse.json({data:result},{status:201}):NextResponse.json({error:"Deal must be completed and accessible"},{status:403});
}
