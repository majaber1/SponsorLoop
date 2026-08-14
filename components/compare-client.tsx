"use client";

import { useState } from "react";
import type { Locale, Opportunity } from "@/lib/types";
import { Check, Close, Layers, Shield } from "./icons";

export function CompareClient({ locale, items }: { locale: Locale; items: Opportunity[] }) {
  const ar = locale === "ar";
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev);
  };

  const chosen = selected.map((id) => items.find((x) => x.id === id)!).filter(Boolean);

  return (
    <div>
      {/* Selector */}
      <div className="compare-selector">
        <strong>{ar ? `اختر فرصًا للمقارنة (${selected.length}/3)` : `Select opportunities to compare (${selected.length}/3)`}</strong>
        <div className="compare-chips">
          {items.map((item) => (
            <button
              key={item.id}
              className={`compare-chip ${selected.includes(item.id) ? "active" : ""}`}
              onClick={() => toggle(item.id)}
              disabled={!selected.includes(item.id) && selected.length >= 3}
            >
              {selected.includes(item.id) && <Check size={14} />}
              {ar ? item.titleAr.slice(0, 40) : item.titleEn.slice(0, 40)}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      {chosen.length >= 2 && (
        <div className="compare-table-wrap">
          <div className="compare-table" style={{ gridTemplateColumns: `180px repeat(${chosen.length}, 1fr)` }}>
            {/* Header */}
            <div className="compare-cell compare-label" />
            {chosen.map((o) => (
              <div key={o.id} className="compare-cell compare-head">
                <button className="compare-remove" onClick={() => toggle(o.id)}><Close size={14} /></button>
                <div className={`compare-cover cover-${o.category}`}>
                  <span className="cover-monogram">{o.organizationNameEn.slice(0, 2).toUpperCase()}</span>
                </div>
                <strong>{ar ? o.titleAr : o.titleEn}</strong>
                <small>{ar ? o.organizationNameAr : o.organizationNameEn}</small>
              </div>
            ))}

            {/* Rows */}
            {([
              [ar ? "الفئة" : "Category", (o: Opportunity) => o.category],
              [ar ? "المدينة" : "City", (o: Opportunity) => o.city],
              [ar ? "السعر" : "Price", (o: Opportunity) => `${o.startingPrice.toLocaleString()} SAR`],
              [ar ? "الوصول التقديري" : "Est. Reach", (o: Opportunity) => o.estimatedReach.toLocaleString()],
              [ar ? "الجمهور" : "Audience", (o: Opportunity) => o.audience.join(", ")],
              [ar ? "الأشكال" : "Formats", (o: Opportunity) => o.formats.join(", ")],
              [ar ? "حالة التحقق" : "Verification", (o: Opportunity) => o.verified ? "✓ " + (ar ? "موثّق" : "Verified") : ar ? "قيد التحقق" : "Pending"],
              [ar ? "نقاط الثقة" : "Trust Score", (o: Opportunity) => `${o.trustScore}/100`],
              [ar ? "الأداء" : "Performance", (o: Opportunity) => `${o.performanceScore}/100`],
              [ar ? "التوافر" : "Availability", (o: Opportunity) => `${o.availabilityScore}/100`],
              [ar ? "التكلفة لكل ألف" : "Cost per 1K reach", (o: Opportunity) => `${Math.round(o.startingPrice / (o.estimatedReach / 1000))} SAR`],
            ] as [string, (o: Opportunity) => string][]).map(([label, fn]) => (
              <>
                <div className="compare-cell compare-label" key={`l-${label}`}>{label}</div>
                {chosen.map((o) => {
                  const val = fn(o);
                  const isVerified = label.includes("Verif") || label.includes("التحقق");
                  return (
                    <div key={`${o.id}-${label}`} className={`compare-cell ${isVerified && o.verified ? "cell-good" : ""}`}>
                      {isVerified && o.verified && <Shield size={14} />}
                      {val}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      )}

      {chosen.length < 2 && (
        <div className="empty-state">
          <Layers size={28} />
          <h3>{ar ? "اختر فرصتين على الأقل" : "Select at least 2 opportunities"}</h3>
          <p>{ar ? "اضغط على الفرص أعلاه لبدء المقارنة." : "Click the opportunities above to start comparing."}</p>
        </div>
      )}
    </div>
  );
}
