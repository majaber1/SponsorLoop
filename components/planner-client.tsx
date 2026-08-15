"use client";

import { useEffect, useState } from "react";
import type { Locale, MatchResult, OpportunityCategory } from "@/lib/types";
import { OpportunityCard } from "./opportunity-card";
import { Sparkles } from "./icons";

const categoryOptions: { id: OpportunityCategory; ar: string; en: string }[] = [
  { id: "events", ar: "فعاليات", en: "Events" }, { id: "creators", ar: "صناع محتوى", en: "Creators" },
  { id: "podcasts", ar: "بودكاست", en: "Podcasts" }, { id: "sports", ar: "رياضة", en: "Sports" },
  { id: "athletes", ar: "رياضيون", en: "Athletes" }, { id: "hackathons", ar: "هاكاثونات", en: "Hackathons" },
  { id: "clubs", ar: "أندية", en: "Clubs" }, { id: "digital", ar: "رقمي", en: "Digital" },
  { id: "ooh", ar: "خارجي", en: "OOH" }, { id: "community", ar: "مجتمعات", en: "Communities" },
  { id: "gaming", ar: "Gaming", en: "Gaming" }
];

export function PlannerClient({ locale, initialBudget = 50000, initialObjective = "leads" }: { locale: Locale; initialBudget?: number; initialObjective?: string }) {
  const ar = locale === "ar";
  const [budget,setBudget] = useState(initialBudget);
  const [objective,setObjective] = useState(initialObjective);
  const [city,setCity] = useState("Riyadh");
  const [audience,setAudience] = useState("CIO, CISO, Technology");
  const [categories,setCategories] = useState<OpportunityCategory[]>([]);
  const [results,setResults] = useState<MatchResult[]>([]);
  const [mode,setMode] = useState("");
  const [narrative,setNarrative] = useState<string | null>(null);
  const [loading,setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/match", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ title: "Planner", objective, budget, city, categories: categories.length ? categories : undefined, audience: audience.split(",").map((x)=>x.trim()).filter(Boolean) }) });
      const json = await response.json();
      setResults(json.data ?? []); setMode(json.mode ?? ""); setNarrative(json.aiNarrative ?? null);
    } finally { setLoading(false); }
  };
  useEffect(()=>{ void run(); // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  const toggle = (id: OpportunityCategory) => setCategories((current)=>current.includes(id) ? current.filter((x)=>x!==id) : [...current,id]);
  const mixTotal = results.slice(0,3).reduce((sum,r)=>sum+r.opportunity.startingPrice,0);
  return <div className="planner-layout">
    <aside className="planner-sidebar panel">
      <div className="eyebrow"><Sparkles size={17}/>{ar ? "موجّه بالبيانات" : "Data-guided"}</div>
      <h2>{ar ? "صف حملتك" : "Describe your campaign"}</h2>
      <label className="field"><span>{ar ? "الميزانية" : "Budget"}</span><div className="money-input"><input type="number" min="1000" value={budget} onChange={(e)=>setBudget(Number(e.target.value))}/><b>SAR</b></div></label>
      <label className="field"><span>{ar ? "الهدف" : "Objective"}</span><select value={objective} onChange={(e)=>setObjective(e.target.value)}><option value="leads">{ar ? "عملاء محتملون" : "Lead generation"}</option><option value="awareness">{ar ? "وعي بالعلامة" : "Brand awareness"}</option><option value="thought_leadership">{ar ? "قيادة فكرية" : "Thought leadership"}</option><option value="engagement">{ar ? "تفاعل" : "Engagement"}</option><option value="launch">{ar ? "إطلاق" : "Launch"}</option></select></label>
      <label className="field"><span>{ar ? "المدينة" : "City"}</span><select value={city} onChange={(e)=>setCity(e.target.value)}><option value="Riyadh">Riyadh</option><option value="Jeddah">Jeddah</option><option value="Dammam">Dammam</option><option value="Makkah">Makkah</option><option value="Madinah">Madinah</option><option value="Khobar">Khobar</option><option value="Tabuk">Tabuk</option></select></label>
      <label className="field"><span>{ar ? "الجمهور — افصل بفاصلة" : "Audience — comma separated"}</span><input value={audience} onChange={(e)=>setAudience(e.target.value)}/></label>
      <div className="field"><span>{ar ? "القنوات المفضلة — اختياري" : "Preferred channels — optional"}</span><div className="check-chips">{categoryOptions.map((x)=><button type="button" key={x.id} onClick={()=>toggle(x.id)} className={categories.includes(x.id)?"active":""}>{ar?x.ar:x.en}</button>)}</div></div>
      <button className="button button-primary full" onClick={run} disabled={loading}><Sparkles size={18}/>{loading ? (ar?"أحلل الفرص...":"Analyzing...") : (ar?"أعد بناء الخطة":"Rebuild plan")}</button>
    </aside>
    <section className="planner-results">
      <div className="results-head"><div><span className="eyebrow">SponsorLoop AI</span><h1>{ar ? "أفضل الفرص لهذه الحملة" : "Best opportunities for this campaign"}</h1><p>{ar ? "الترتيب مبني على ملاءمة الجمهور والهدف والميزانية والموقع والثقة والأداء والتوافر." : "Ranking combines audience, objective, budget, geography, trust, performance and availability."}</p></div><span className="mode-pill">{mode === "deterministic+ai" ? "Scoring + AI" : ar ? "تقييم قابل للتفسير" : "Explainable scoring"}</span></div>
      {results.length>0 && <div className="recommendation-summary panel"><div><small>{ar ? "الخطة المقترحة — أفضل 3" : "Suggested mix — top 3"}</small><strong>{mixTotal.toLocaleString()} SAR</strong></div><div><small>{ar ? "من ميزانية" : "of budget"}</small><strong>{budget.toLocaleString()} SAR</strong></div><div><small>{ar ? "المتبقي" : "Remaining"}</small><strong>{Math.max(0,budget-mixTotal).toLocaleString()} SAR</strong></div></div>}
      {narrative && <div className="ai-note panel"><Sparkles/><div><strong>{ar?"تفسير AI":"AI narrative"}</strong><p>{narrative}</p></div></div>}
      <div className="opportunity-grid">{results.map((result)=><div key={result.opportunity.id} className="match-wrap"><OpportunityCard locale={locale} item={result.opportunity} score={result.score}/><div className="match-reasons">{(ar?result.reasonsAr:result.reasonsEn).slice(0,3).map((x)=><span key={x}>• {x}</span>)}</div></div>)}</div>
    </section>
  </div>;
}
