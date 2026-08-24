import { NextResponse } from "next/server";
import { z } from "zod";
import { listOpportunities } from "@/lib/repository";
import { matchOpportunities } from "@/lib/matching";

const schema = z.object({
  title: z.string().default("Campaign"),
  objective: z.string().default("awareness"),
  budget: z.number().positive(),
  city: z.string().optional(),
  categories: z.array(z.enum(["events", "creators", "podcasts", "sports", "digital", "ooh", "community", "gaming", "athletes", "hackathons", "clubs"])).optional(),
  audience: z.array(z.string()).optional()
});

async function explainWithProvider(payload: unknown) {
  const url = process.env.AI_PROVIDER_URL;
  const key = process.env.AI_PROVIDER_API_KEY;
  const model = process.env.AI_MODEL;
  if (!url || !key || !model) return null;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({ model, temperature: 0.2, messages: [
        { role: "system", content: "You are SponsorLoop's sponsorship analyst. Do not invent opportunities, prices, reach or metrics. Explain only the supplied deterministic matches in concise Arabic and English." },
        { role: "user", content: JSON.stringify(payload) }
      ] })
    });
    if (!response.ok) return null;
    const json = await response.json();
    return json?.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid matching request" }, { status: 400 });
  const opportunities = await listOpportunities();
  const matches = matchOpportunities(parsed.data, opportunities).slice(0, 8);
  const aiNarrative = await explainWithProvider({ campaign: parsed.data, matches: matches.slice(0, 5).map((m) => ({ id: m.opportunity.id, score: m.score, title: m.opportunity.titleEn, reasons: m.reasonsEn })) });
  return NextResponse.json({ data: matches, mode: aiNarrative ? "deterministic+ai" : "deterministic", aiNarrative });
}
