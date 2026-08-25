import { NextResponse } from "next/server";
import { z } from "zod";
import { listOpportunities } from "@/lib/repository";
import { matchOpportunities } from "@/lib/matching";
import { generateStructured } from "@/lib/openai";
import { getSession } from "@/lib/session";

const schema = z.object({
  title: z.string().default("Campaign"),
  objective: z.string().default("awareness"),
  budget: z.number().positive(),
  city: z.string().optional(),
  categories: z.array(z.enum(["events", "creators", "podcasts", "sports", "digital", "ooh", "community", "gaming", "athletes", "hackathons", "clubs"])).optional(),
  audience: z.array(z.string()).optional()
});

async function explainWithOpenAI(payload: unknown) {
  try {
    return await generateStructured<{ summaryAr: string; summaryEn: string }>({
      name: "sponsor_match_explanation",
      instructions: "You are SponsorLoop's sponsorship analyst for the Saudi market. Explain only the supplied deterministic match results. Never invent opportunities, prices, reach, metrics, approvals, or legal conclusions. Be concise and actionable in both Arabic and English.",
      input: payload,
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { summaryAr: { type: "string" }, summaryEn: { type: "string" } },
        required: ["summaryAr", "summaryEn"]
      }
    });
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid matching request" }, { status: 400 });
  const opportunities = await listOpportunities();
  const matches = matchOpportunities(parsed.data, opportunities).slice(0, 8);
  const session = await getSession();
  const ai = session ? await explainWithOpenAI({ campaign: parsed.data, matches: matches.slice(0, 5).map((m) => ({ id: m.opportunity.id, score: m.score, titleAr: m.opportunity.titleAr, titleEn: m.opportunity.titleEn, startingPrice: m.opportunity.startingPrice, reasonsAr: m.reasonsAr, reasonsEn: m.reasonsEn })) }) : null;
  return NextResponse.json({ data: matches, mode: ai ? "deterministic+openai" : "deterministic", aiNarrative: ai?.data ?? null, aiModel: ai?.model ?? null });
}
