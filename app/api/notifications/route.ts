import { NextResponse } from "next/server";
import { listNotifications, markNotificationRead } from "@/lib/repository";
import { getSession } from "@/lib/session";

export async function GET() {
  const user=await getSession(); if(!user) return NextResponse.json({error:"Authentication required"},{status:401});
  const items = await listNotifications(user.id);
  return NextResponse.json({ data: items });
}

export async function PATCH(request: Request) {
  const user=await getSession(); if(!user) return NextResponse.json({error:"Authentication required"},{status:401});
  const { id } = await request.json();
  const result = await markNotificationRead(id,user.id);
  return result ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found" }, { status: 404 });
}
