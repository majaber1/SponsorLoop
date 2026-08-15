"use client";

import { useState } from "react";
import type { Locale, Opportunity } from "@/lib/types";
import { Calculator, TrendingUp } from "./icons";

export function ROICalculator({ locale, opportunity }: { locale: Locale; opportunity: Opportunity }) {
  const ar = locale === "ar";
  const [investment, setInvestment] = useState(opportunity.startingPrice);
  const [conversionRate, setConversionRate] = useState(2);
  const [avgDealValue, setAvgDealValue] = useState(500);

  const estimatedImpressions = opportunity.estimatedReach;
  const estimatedLeads = Math.round(estimatedImpressions * (conversionRate / 100));
  const estimatedRevenue = estimatedLeads * avgDealValue;
  const roi = investment > 0 ? Math.round(((estimatedRevenue - investment) / investment) * 100) : 0;
  const cpm = estimatedImpressions > 0 ? ((investment / estimatedImpressions) * 1000).toFixed(1) : "0";
  const costPerLead = estimatedLeads > 0 ? Math.round(investment / estimatedLeads) : 0;

  return (
    <div className="roi-calculator panel">
      <div className="roi-header">
        <Calculator size={20} />
        <h3>{ar ? "حاسبة العائد على الاستثمار" : "ROI Calculator"}</h3>
      </div>

      <div className="roi-inputs">
        <label className="field">
          <span>{ar ? "الاستثمار (ر.س)" : "Investment (SAR)"}</span>
          <input type="number" min="1000" value={investment} onChange={(e) => setInvestment(Number(e.target.value))} />
        </label>
        <label className="field">
          <span>{ar ? "معدل التحويل %" : "Conversion rate %"}</span>
          <input type="number" min="0.1" max="100" step="0.1" value={conversionRate} onChange={(e) => setConversionRate(Number(e.target.value))} />
        </label>
        <label className="field">
          <span>{ar ? "متوسط قيمة العميل (ر.س)" : "Avg deal value (SAR)"}</span>
          <input type="number" min="1" value={avgDealValue} onChange={(e) => setAvgDealValue(Number(e.target.value))} />
        </label>
      </div>

      <div className="roi-results">
        <div className={`roi-big ${roi >= 0 ? "positive" : "negative"}`}>
          <TrendingUp size={22} />
          <div>
            <small>{ar ? "العائد المتوقع" : "Estimated ROI"}</small>
            <strong>{roi}%</strong>
          </div>
        </div>
        <div className="roi-grid">
          <div>
            <small>{ar ? "عملاء متوقعون" : "Est. leads"}</small>
            <strong>{estimatedLeads.toLocaleString()}</strong>
          </div>
          <div>
            <small>{ar ? "إيراد متوقع" : "Est. revenue"}</small>
            <strong>{estimatedRevenue.toLocaleString()} SAR</strong>
          </div>
          <div>
            <small>CPM</small>
            <strong>{cpm} SAR</strong>
          </div>
          <div>
            <small>{ar ? "تكلفة العميل" : "Cost per lead"}</small>
            <strong>{costPerLead.toLocaleString()} SAR</strong>
          </div>
        </div>
      </div>

      <p className="roi-disclaimer">
        {ar
          ? "* تقديرات مبنية على بيانات الوصول المعلنة. النتائج الفعلية تعتمد على جودة الحملة والجمهور."
          : "* Estimates based on declared reach data. Actual results depend on campaign quality and audience fit."}
      </p>
    </div>
  );
}
