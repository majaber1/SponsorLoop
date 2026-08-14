import { CompareClient } from "@/components/compare-client";
import { isLocale } from "@/lib/i18n";
import { listOpportunities } from "@/lib/repository";

export default async function ComparePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const items = await listOpportunities();
  return (
    <section className="page-section">
      <div className="container">
        <div className="page-title centered">
          <span className="eyebrow">Compare</span>
          <h1>{locale === "ar" ? "قارن الفرص جنبًا إلى جنب" : "Compare opportunities side by side"}</h1>
          <p>{locale === "ar" ? "اختر حتى 3 فرص لمقارنة الأسعار والوصول والجمهور والثقة والأداء." : "Select up to 3 opportunities to compare pricing, reach, audience, trust and performance."}</p>
        </div>
        <CompareClient locale={locale} items={items} />
      </div>
    </section>
  );
}
