import { NextResponse } from "next/server";
import { addDealMessage, listDealMessages } from "@/lib/repository";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const items = await listDealMessages(id);
  return NextResponse.json({ data: items });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { message, senderName, senderRole } = await request.json();
  if (!message) return NextResponse.json({ error: "message required" }, { status: 400 });
  const result = await addDealMessage({ dealId: id, senderName: senderName ?? "Demo User", senderRole: senderRole ?? "buyer", message });
  return NextResponse.json({ data: result });
}
