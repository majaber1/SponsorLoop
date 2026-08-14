import { NextResponse } from "next/server";
import { listNotifications, markNotificationRead } from "@/lib/repository";

export async function GET() {
  const items = await listNotifications();
  return NextResponse.json({ data: items });
}

export async function PATCH(request: Request) {
  const { id } = await request.json();
  const result = await markNotificationRead(id);
  return result ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found" }, { status: 404 });
}
