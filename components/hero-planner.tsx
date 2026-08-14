"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/types";
import { Search, Sparkles } from "./icons";

export function HeroPlanner({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const router = useRouter();
  const [budget, setBudget] = useState("50000");
  const [objective, setObjective] = useState("leads");
  const go = () => router.push(`/${locale}/planner?budget=${encodeURIComponent(budget)}&objective=${objective}`);
  return (
    <div className="hero-planner panel-glass">
      <div className="planner-label"><Sparkles size={18}/><span>{ar ? "SponsorLoop AI" : "SponsorLoop AI"}</span><small>{ar ? "مخطط الحملة الذكي" : "Smart campaign planner"}</small></div>
      <div className="planner-inputs">
        <label><span>{ar ? "ميزانية الحملة" : "Campaign budget"}</span><div className="money-input"><input value={budget} onChange={(e) => setBudget(e.target.value.replace(/\D/g,""))} inputMode="numeric"/><b>{ar ? "ر.س" : "SAR"}</b></div></label>
        <label><span>{ar ? "هدفي الأساسي" : "Primary goal"}</span><select value={objective} onChange={(e) => setObjective(e.target.value)}><option value="leads">{ar ? "عملاء محتملون" : "Lead generation"}</option><option value="awareness">{ar ? "وعي بالعلامة" : "Brand awareness"}</option><option value="thought_leadership">{ar ? "قيادة فكرية" : "Thought leadership"}</option><option value="engagement">{ar ? "تفاعل" : "Engagement"}</option><option value="launch">{ar ? "إطلاق منتج" : "Product launch"}</option></select></label>
        <button className="button button-primary planner-submit" onClick={go}><Search size={18}/>{ar ? "ابنِ خطتي" : "Build my plan"}</button>
      </div>
      <div className="planner-trust"><span className="pulse-dot"/><span>{ar ? "يطابق الفرص الحقيقية فقط — لا يخترع بيانات" : "Matches real listed inventory only — no invented data"}</span></div>
    </div>
  );
}
