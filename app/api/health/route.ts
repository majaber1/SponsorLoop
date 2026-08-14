import { NextResponse } from "next/server";
import { databaseEnabled, query } from "@/lib/db";

export async function GET() {
  let database = "demo";
  if (databaseEnabled) {
    try {
      await query("SELECT 1");
      database = "connected";
    } catch {
      database = "error";
    }
  }
  return NextResponse.json({
    status: database === "error" ? "degraded" : "ok",
    app: "SponsorLoop",
    version: "2.0.0",
    database,
    ai: process.env.AI_PROVIDER_URL && process.env.AI_PROVIDER_API_KEY ? "configured" : "deterministic-fallback",
    storage: process.env.OBJECT_STORAGE_URL && process.env.OBJECT_STORAGE_TOKEN ? "configured" : "not_configured",
    payments: process.env.PAYMENT_PROVIDER_URL && process.env.PAYMENT_PROVIDER_TOKEN ? "configured" : "not_configured",
    esign: process.env.ESIGN_PROVIDER_URL && process.env.ESIGN_PROVIDER_TOKEN ? "configured" : "not_configured"
  });
}
