import { matchOpportunities } from "../lib/matching";
import type { Opportunity } from "../lib/types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const base: Opportunity = {
  id: "1",
  organizationId: "o",
  organizationNameAr: "اختبار",
  organizationNameEn: "Test",
  category: "podcasts",
  titleAr: "اختبار",
  titleEn: "Test",
  descriptionAr: "",
  descriptionEn: "",
  city: "Riyadh",
  startingPrice: 20000,
  currency: "SAR",
  estimatedReach: 50000,
  audience: ["CIO", "Technology"],
  formats: ["Audio"],
  verified: true,
  trustScore: 95,
  availabilityScore: 90,
  performanceScore: 88
};

const weaker: Opportunity = { ...base, id: "2", city: "Jeddah", startingPrice: 70000, verified: false, trustScore: 60 };
const results = matchOpportunities({ title: "x", objective: "thought_leadership", budget: 40000, city: "Riyadh", audience: ["CIO"] }, [weaker, base]);
assert(results[0].opportunity.id === "1", "best-fit opportunity should rank first");
assert(results[0].score > results[1].score, "stronger opportunity should outscore weaker opportunity");
assert(results[0].score >= 80, "high-fit opportunity should score at least 80");
console.log("matching test: PASS", results.map((r) => ({ id: r.opportunity.id, score: r.score })));
