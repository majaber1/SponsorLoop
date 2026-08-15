"use client";

import { useMemo, useState } from "react";
import type { Locale, Opportunity, OpportunityCategory } from "@/lib/types";
import { OpportunityCard } from "./opportunity-card";
import { Grid, List, Search } from "./icons";

const cats: { id: "all" | OpportunityCategory; ar: string; en: string }[] = [
  { id: "all", ar: "الكل", en: "All" }, { id: "events", ar: "فعاليات", en: "Events" }, { id: "creators", ar: "صناع محتوى", en: "Creators" },
  { id: "podcasts", ar: "بودكاست وإعلام", en: "Podcasts" }, { id: "sports", ar: "رياضة", en: "Sports" }, { id: "athletes", ar: "رياضيون", en: "Athletes" },
  { id: "hackathons", ar: "هاكاثونات", en: "Hackathons" }, { id: "clubs", ar: "أندية", en: "Clubs" }, { id: "digital", ar: "رقمي", en: "Digital" },
  { id: "ooh", ar: "خارجي", en: "OOH" }, { id: "community", ar: "مجتمعات", en: "Communities" }, { id: "gaming", ar: "Gaming", en: "Gaming" }
];

type SortOption = "featured" | "price_asc" | "price_desc" | "reach" | "trust";

export function MarketplaceClient({ locale, items }: { locale: Locale; items: Opportunity[] }) {
  const ar = locale === "ar";
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<"all" | OpportunityCategory>("all");
  const [city, setCity] = useState("all");
  const [max, setMax] = useState(1000000);
  const [sort, setSort] = useState<SortOption>("featured");
  const [view, setView] = useState<"grid" | "list">("grid");

  const cities = useMemo(() => [...new Set(items.map((x) => x.city))].sort(), [items]);

  const filtered = useMemo(() => {
    let data = items.filter((item) => {
      const hay = `${item.titleAr} ${item.titleEn} ${item.organizationNameAr} ${item.organizationNameEn}`.toLowerCase();
      return (!q || hay.includes(q.toLowerCase())) && (category === "all" || item.category === category) && (city === "all" || item.city === city) && item.startingPrice <= max;
    });

    switch (sort) {
      case "price_asc": data.sort((a, b) => a.startingPrice - b.startingPrice); break;
      case "price_desc": data.sort((a, b) => b.startingPrice - a.startingPrice); break;
      case "reach": data.sort((a, b) => b.estimatedReach - a.estimatedReach); break;
      case "trust": data.sort((a, b) => b.trustScore - a.trustScore); break;
      default: data.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return data;
  }, [items, q, category, city, max, sort]);

  return (
    <div>
      <div className="market-toolbar">
        <label className="search-box"><Search size={18}/><input value={q} onChange={(e)=>setQ(e.target.value)} placeholder={ar ? "ابحث عن فعالية، بودكاست، مؤثر..." : "Search events, podcasts, creators..."}/></label>
        <select value={city} onChange={(e)=>setCity(e.target.value)}>
          <option value="all">{ar ? "كل المدن" : "All cities"}</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={max} onChange={(e)=>setMax(Number(e.target.value))}>
          <option value="25000">≤ 25K SAR</option>
          <option value="50000">≤ 50K SAR</option>
          <option value="100000">≤ 100K SAR</option>
          <option value="1000000">{ar ? "كل الميزانيات" : "Any budget"}</option>
        </select>
        <select value={sort} onChange={(e)=>setSort(e.target.value as SortOption)}>
          <option value="featured">{ar ? "مميزة أولاً" : "Featured first"}</option>
          <option value="price_asc">{ar ? "السعر: الأقل" : "Price: Low → High"}</option>
          <option value="price_desc">{ar ? "السعر: الأعلى" : "Price: High → Low"}</option>
          <option value="reach">{ar ? "الوصول الأعلى" : "Highest reach"}</option>
          <option value="trust">{ar ? "الأعلى ثقة" : "Highest trust"}</option>
        </select>
      </div>
      <div className="market-sub-toolbar">
        <div className="category-tabs">{cats.map((cat)=><button key={cat.id} className={category===cat.id ? "active" : ""} onClick={()=>setCategory(cat.id)}>{ar ? cat.ar : cat.en}</button>)}</div>
        <div className="view-toggle">
          <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")} aria-label="Grid"><Grid size={16}/></button>
          <button className={view === "list" ? "active" : ""} onClick={() => setView("list")} aria-label="List"><List size={16}/></button>
        </div>
      </div>
      <div className="results-meta"><strong>{filtered.length}</strong> {ar ? "فرصة متاحة" : "opportunities available"}</div>
      <div className={view === "grid" ? "opportunity-grid" : "opportunity-list"}>
        {filtered.map((item) => <OpportunityCard key={item.id} locale={locale} item={item} compact={view === "list"} />)}
      </div>
      {!filtered.length && <div className="empty-state"><Search size={28}/><h3>{ar ? "لا توجد نتائج بهذه الفلاتر" : "No opportunities match these filters"}</h3><p>{ar ? "جرّب توسيع الميزانية أو اختيار فئة أخرى." : "Try a broader budget or another category."}</p></div>}
    </div>
  );
}
