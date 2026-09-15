"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, Chart, Shield } from "@/components/icons";
import type { Locale, OnboardingStep, OpportunityCategory } from "@/lib/types";

const categories: { slug: OpportunityCategory; ar: string; en: string }[] = [
  { slug: "events", ar: "الفعاليات", en: "Events" },
  { slug: "creators", ar: "صناع المحتوى", en: "Creators" },
  { slug: "podcasts", ar: "البودكاست", en: "Podcasts" },
  { slug: "sports", ar: "الرياضة", en: "Sports" },
  { slug: "digital", ar: "الرقمي", en: "Digital" },
  { slug: "gaming", ar: "الألعاب", en: "Gaming" },
  { slug: "athletes", ar: "الرياضيون", en: "Athletes" },
  { slug: "hackathons", ar: "الهاكاثونات", en: "Hackathons" }
];

const cities = ["Riyadh", "Jeddah", "Dammam", "Makkah", "Madinah", "Khobar", "Tabuk"];

export function OnboardingWizard({ locale, userName, userRole }: { locale: Locale; userName: string; userRole: string }) {
  const ar = locale === "ar";
  const [step, setStep] = useState<OnboardingStep>("role");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState("");

  function toggleCategory(slug: string) {
    setSelectedCategories((prev) => prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]);
  }

  function toggleCity(city: string) {
    setSelectedCities((prev) => prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]);
  }

  const isAdvertiser = userRole === "advertiser" || userRole === "admin";

  return (
    <div className="onboarding-wizard">
      <div className="onboarding-progress">
        {(["role", "preferences", "complete"] as OnboardingStep[]).map((s, i) => (
          <div key={s} className={`onboarding-step-indicator ${step === s ? "active" : ""} ${(["role", "preferences", "complete"].indexOf(step) > i) ? "done" : ""}`}>
            <span>{(["role", "preferences", "complete"].indexOf(step) > i) ? <Check size={14} /> : i + 1}</span>
            <small>
              {s === "role" ? (ar ? "دورك" : "Your Role")
                : s === "preferences" ? (ar ? "التفضيلات" : "Preferences")
                : (ar ? "جاهز" : "Ready")}
            </small>
          </div>
        ))}
      </div>

      {step === "role" && (
        <div className="panel form-card onboarding-panel">
          <div className="onboarding-icon"><Sparkles size={32} /></div>
          <h2>{ar ? `مرحبًا ${userName}!` : `Welcome, ${userName}!`}</h2>
          <p>{ar ? "كيف ستستخدم SponsorLoop بشكل أساسي؟" : "How will you primarily use SponsorLoop?"}</p>

          <div className="onboarding-role-grid">
            <button className={`onboarding-role-card panel ${!isAdvertiser ? "selected" : ""}`} onClick={() => setStep("preferences")}>
              <Chart size={24} />
              <strong>{ar ? "أملك فرصًا رعوية" : "I have sponsorship inventory"}</strong>
              <small>{ar ? "أريد عرض فرص الرعاية وجذب الرعاة" : "I want to list opportunities and attract sponsors"}</small>
            </button>
            <button className={`onboarding-role-card panel ${isAdvertiser ? "selected" : ""}`} onClick={() => setStep("preferences")}>
              <Sparkles size={24} />
              <strong>{ar ? "أبحث عن رعايات" : "I'm looking for sponsorships"}</strong>
              <small>{ar ? "أريد اكتشاف ورعاية فرص إعلانية" : "I want to discover and sponsor opportunities"}</small>
            </button>
          </div>
        </div>
      )}

      {step === "preferences" && (
        <div className="panel form-card onboarding-panel">
          <h2>{ar ? "ما التصنيفات التي تهمك؟" : "What categories interest you?"}</h2>
          <p>{ar ? "اختر واحدًا أو أكثر لتخصيص التوصيات." : "Select one or more to personalize recommendations."}</p>

          <div className="check-chips" style={{ marginBottom: 24 }}>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                className={selectedCategories.includes(cat.slug) ? "active" : ""}
                onClick={() => toggleCategory(cat.slug)}
              >
                {ar ? cat.ar : cat.en}
              </button>
            ))}
          </div>

          <h3 style={{ fontSize: 16, margin: "0 0 10px" }}>{ar ? "المدن المفضلة" : "Preferred Cities"}</h3>
          <div className="check-chips" style={{ marginBottom: 24 }}>
            {cities.map((city) => (
              <button
                key={city}
                type="button"
                className={selectedCities.includes(city) ? "active" : ""}
                onClick={() => toggleCity(city)}
              >
                {city}
              </button>
            ))}
          </div>

          {isAdvertiser && (
            <>
              <h3 style={{ fontSize: 16, margin: "0 0 10px" }}>{ar ? "نطاق الميزانية" : "Budget Range"}</h3>
              <div className="field">
                <select value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)}>
                  <option value="">{ar ? "اختر..." : "Select..."}</option>
                  <option value="10k-50k">10K – 50K SAR</option>
                  <option value="50k-150k">50K – 150K SAR</option>
                  <option value="150k-500k">150K – 500K SAR</option>
                  <option value="500k+">500K+ SAR</option>
                </select>
              </div>
            </>
          )}

          <div className="form-footer">
            <button type="button" className="button button-secondary" onClick={() => setStep("role")}>
              {ar ? "رجوع" : "Back"}
            </button>
            <button type="button" className="button button-primary" onClick={() => setStep("complete")}>
              {ar ? "متابعة" : "Continue"}
            </button>
          </div>
        </div>
      )}

      {step === "complete" && (
        <div className="panel form-card onboarding-panel" style={{ textAlign: "center" }}>
          <div className="onboarding-icon"><Shield size={40} /></div>
          <h2>{ar ? "تم إعداد حسابك!" : "Your account is ready!"}</h2>
          <p>{ar ? "يمكنك الآن استكشاف الفرص وإنشاء الحملات وبدء الصفقات." : "You can now explore opportunities, create campaigns and start deals."}</p>

          <div className="onboarding-actions">
            <Link className="button button-primary large" href={`/${locale}/marketplace`}>
              {ar ? "استكشف السوق" : "Explore Marketplace"}
            </Link>
            <Link className="button button-secondary large" href={`/${locale}/dashboard`}>
              {ar ? "لوحة التحكم" : "Go to Dashboard"}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
