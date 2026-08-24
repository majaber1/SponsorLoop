import { NextResponse } from "next/server";
import { addDealMessage, listDealMessages } from "@/lib/repository";
import { getSession } from "@/lib/session";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user=await getSession(); if(!user) return NextResponse.json({error:"Authentication required"},{status:401});
  const items = await listDealMessages(id,user.organizationId,user.role==="admin");
  return NextResponse.json({ data: items });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user=await getSession(); if(!user) return NextResponse.json({error:"Authentication required"},{status:401});
  const { message, senderName, senderRole } = await request.json();
  if (!message) return NextResponse.json({ error: "message required" }, { status: 400 });
  const result = await addDealMessage({ dealId: id, senderName: user.name, senderRole: senderRole ?? (user.role==="owner"?"seller":"buyer"), message, senderUserId:user.id,actorOrgId:user.organizationId,isAdmin:user.role==="admin" });
  return result?NextResponse.json({ data: result },{status:201}):NextResponse.json({error:"Not authorized"},{status:403});
}
