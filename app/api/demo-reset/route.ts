import { NextResponse } from "next/server";
import { databaseEnabled } from "@/lib/db";
import { resetDemoState } from "@/lib/demo-store";

export async function POST() {
  if (databaseEnabled) {
    return NextResponse.json({ error: "Demo reset not available in production mode" }, { status: 400 });
  }
  resetDemoState();
  return NextResponse.json({ success: true, message: "Demo data has been reset to defaults" });
}
