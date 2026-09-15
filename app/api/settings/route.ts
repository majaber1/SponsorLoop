import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getUserSettings, updateUserSettings } from "@/lib/repository";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const settings = await getUserSettings(session.id);
  if (!settings) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(settings);
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const displayName = typeof body.displayName === "string" ? body.displayName.trim() : undefined;
  const locale = typeof body.locale === "string" ? body.locale : undefined;
  if (!displayName && !locale) return NextResponse.json({ error: "No changes" }, { status: 400 });
  const ok = await updateUserSettings(session.id, { displayName, locale });
  if (!ok) return NextResponse.json({ error: "Update failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
