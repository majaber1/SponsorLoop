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

  const r2Configured = [
    "R2_ACCOUNT_ID",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_BUCKET",
  ].every((key) => Boolean(process.env[key]));

  return NextResponse.json({
    status: database === "error" ? "degraded" : "ok",
    app: "SponsorLoop",
    version: "2.0.0",
    database,
    ai: process.env.OPENAI_API_KEY ? "openai-configured" : "deterministic-fallback",
    aiModel: process.env.OPENAI_MODEL || "gpt-5.4-mini",
    storage: r2Configured ? "configured" : "not_configured",
    storageProvider: r2Configured ? "cloudflare-r2" : "none",
    payments: process.env.PAYMENT_PROVIDER_URL && process.env.PAYMENT_PROVIDER_TOKEN ? "configured" : "not_configured",
    esign: process.env.ESIGN_PROVIDER_URL && process.env.ESIGN_PROVIDER_TOKEN ? "configured" : "not_configured"
  });
}
