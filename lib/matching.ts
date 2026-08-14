import type { CampaignInput, MatchResult, Opportunity } from "./types";

const objectiveMap: Record<string, string[]> = {
  awareness: ["events", "creators", "podcasts", "sports", "ooh", "gaming"],
  leads: ["events", "podcasts", "digital", "community"],
  engagement: ["creators", "sports", "gaming", "community"],
  launch: ["events", "creators", "digital", "ooh", "podcasts"],
  thought_leadership: ["podcasts", "events", "creators", "community"]
};

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

function budgetFit(budget: number, price: number) {
  if (budget <= 0) return 0;
  if (price <= budget * 0.35) return 100;
  if (price <= budget * 0.6) return 95;
  if (price <= budget) return 85;
  if (price <= budget * 1.15) return 55;
  if (price <= budget * 1.35) return 25;
  return 5;
}

function audienceFit(target: string[] = [], opportunity: Opportunity) {
  if (!target.length) return 72;
  const haystack = opportunity.audience.join(" ").toLowerCase();
  const hits = target.filter((term) => haystack.includes(term.toLowerCase())).length;
  return clamp(45 + (hits / target.length) * 55);
}

function objectiveFit(objective: string, opportunity: Opportunity) {
  const preferred = objectiveMap[objective] ?? [];
  return preferred.includes(opportunity.category) ? 96 : 62;
}

function geographyFit(city: string | undefined, opportunity: Opportunity) {
  if (!city) return 82;
  return opportunity.city.toLowerCase() === city.toLowerCase() ? 100 : 58;
}

export function matchOpportunities(campaign: CampaignInput, opportunities: Opportunity[]): MatchResult[] {
  return opportunities
    .filter((opportunity) => !campaign.categories?.length || campaign.categories.includes(opportunity.category))
    .map((opportunity) => {
      const components = {
        audience: audienceFit(campaign.audience, opportunity),
        objective: objectiveFit(campaign.objective, opportunity),
        budget: budgetFit(campaign.budget, opportunity.startingPrice),
        geography: geographyFit(campaign.city, opportunity),
        trust: opportunity.trustScore,
        performance: opportunity.performanceScore,
        availability: opportunity.availabilityScore,
        brandSafety: opportunity.verified ? 96 : 55
      };

      const score =
        components.audience * 0.25 +
        components.objective * 0.2 +
        components.budget * 0.15 +
        components.geography * 0.1 +
        components.trust * 0.1 +
        components.performance * 0.1 +
        components.availability * 0.05 +
        components.brandSafety * 0.05;

      const reasonsAr = [
        components.audience >= 80 ? "الجمهور قريب من الشريحة المستهدفة" : "يوفر شريحة جماهيرية مكملة",
        components.budget >= 80 ? "مناسب للميزانية المتاحة" : "يحتاج ضبط الحزمة أو التفاوض",
        components.geography >= 90 ? "تطابق قوي مع الموقع المستهدف" : "الوصول الجغرافي أوسع من النطاق المطلوب",
        opportunity.verified ? "الجهة والفرصة موثقتان داخل المنصة" : "يحتاج استكمال التحقق"
      ];
      const reasonsEn = [
        components.audience >= 80 ? "Strong audience alignment" : "Adds a complementary audience segment",
        components.budget >= 80 ? "Fits the available budget" : "Package or price should be negotiated",
        components.geography >= 90 ? "Strong geographic fit" : "Geographic reach is broader than requested",
        opportunity.verified ? "Opportunity and owner are verified" : "Verification is still required"
      ];

      return { opportunity, score: Math.round(score), components, reasonsAr, reasonsEn };
    })
    .sort((a, b) => b.score - a.score);
}
