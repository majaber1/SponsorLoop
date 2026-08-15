import Link from "next/link";
import { Arrow, BarChart, Chart, MapPin, TrendingUp, Trophy, Users } from "@/components/icons";
import { isLocale, localePath } from "@/lib/i18n";
import { listOpportunities } from "@/lib/repository";

export default async function InsightsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const ar = locale === "ar";
  const opportunities = await listOpportunities();

  const totalOpportunities = opportunities.length;
  const avgPrice = Math.round(opportunities.reduce((s, o) => s + o.startingPrice, 0) / totalOpportunities);
  const totalReach = opportunities.reduce((s, o) => s + o.estimatedReach, 0);
  const avgTrust = Math.round(opportunities.reduce((s, o) => s + o.trustScore, 0) / totalOpportunities);
  const verifiedPct = Math.round((opportunities.filter((o) => o.verified).length / totalOpportunities) * 100);

  const categoryStats = Object.entries(
    opportunities.reduce((acc, o) => {
      acc[o.category] = (acc[o.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);

  const cityStats = Object.entries(
    opportunities.reduce((acc, o) => {
      acc[o.city] = (acc[o.city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);

  const priceByCategory = Object.entries(
    opportunities.reduce((acc, o) => {
      if (!acc[o.category]) acc[o.category] = { total: 0, count: 0 };
      acc[o.category].total += o.startingPrice;
      acc[o.category].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>)
  ).map(([cat, data]) => ({ category: cat, avg: Math.round(data.total / data.count) })).sort((a, b) => b.avg - a.avg);

  const categoryLabels: Record<string, { ar: string; en: string }> = {
    events: { ar: "فعاليات", en: "Events" }, creators: { ar: "صناع محتوى", en: "Creators" },
    podcasts: { ar: "بودكاست", en: "Podcasts" }, sports: { ar: "رياضة", en: "Sports" },
    athletes: { ar: "رياضيون", en: "Athletes" }, hackathons: { ar: "هاكاثونات", en: "Hackathons" },
    clubs: { ar: "أندية", en: "Clubs" }, digital: { ar: "رقمي", en: "Digital" },
    ooh: { ar: "خارجي", en: "OOH" }, community: { ar: "مجتمعات", en: "Communities" },
    gaming: { ar: "Gaming", en: "Gaming" }
  };

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-title">
          <span className="eyebrow"><TrendingUp size={16} />{ar ? "ذكاء السوق" : "Market Intelligence"}</span>
          <h1>{ar ? "رؤى وبيانات سوق الرعاية السعودي" : "Saudi Sponsorship Market Insights & Data"}</h1>
          <p>{ar ? "بيانات محدّثة من السوق لمساعدتك في اتخاذ قرارات رعاية مبنية على أرقام حقيقية." : "Live market data to help you make sponsorship decisions backed by real numbers."}</p>
        </div>

        <div className="kpi-5">
          <div className="kpi-card panel">
            <BarChart size={20} />
            <small>{ar ? "إجمالي الفرص" : "Total Opportunities"}</small>
            <strong>{totalOpportunities}</strong>
          </div>
          <div className="kpi-card panel">
            <Chart size={20} />
            <small>{ar ? "متوسط السعر" : "Avg. Price"}</small>
            <strong>{avgPrice.toLocaleString()} SAR</strong>
          </div>
          <div className="kpi-card panel">
            <Users size={20} />
            <small>{ar ? "إجمالي الوصول" : "Total Reach"}</small>
            <strong>{(totalReach / 1000000).toFixed(1)}M</strong>
          </div>
          <div className="kpi-card panel">
            <Trophy size={20} />
            <small>{ar ? "متوسط الثقة" : "Avg. Trust Score"}</small>
            <strong>{avgTrust}/100</strong>
          </div>
          <div className="kpi-card panel">
            <TrendingUp size={20} />
            <small>{ar ? "نسبة الموثّق" : "Verified Rate"}</small>
            <strong>{verifiedPct}%</strong>
          </div>
        </div>

        <div className="insights-grid">
          <div className="insight-panel panel">
            <h2>{ar ? "الفرص حسب الفئة" : "Opportunities by Category"}</h2>
            <div className="insight-bars">
              {categoryStats.map(([cat, count]) => (
                <div key={cat} className="insight-bar-row">
                  <span>{categoryLabels[cat]?.[locale] ?? cat}</span>
                  <div className="insight-bar-track">
                    <div className="insight-bar-fill" style={{ width: `${(count / totalOpportunities) * 100}%` }} />
                  </div>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="insight-panel panel">
            <h2>{ar ? "التوزيع الجغرافي" : "Geographic Distribution"}</h2>
            <div className="insight-bars">
              {cityStats.map(([city, count]) => (
                <div key={city} className="insight-bar-row">
                  <span><MapPin size={13} />{city}</span>
                  <div className="insight-bar-track">
                    <div className="insight-bar-fill geo" style={{ width: `${(count / totalOpportunities) * 100}%` }} />
                  </div>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="insight-panel panel full-width">
            <h2>{ar ? "متوسط السعر حسب الفئة" : "Average Price by Category"}</h2>
            <div className="price-benchmark-grid">
              {priceByCategory.map((item) => (
                <div key={item.category} className="price-benchmark-card">
                  <span className={`category-chip cover-${item.category}`}>
                    {categoryLabels[item.category]?.[locale] ?? item.category}
                  </span>
                  <strong>{item.avg.toLocaleString()} SAR</strong>
                  <small>{ar ? "متوسط السعر" : "avg. starting price"}</small>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="insights-cta panel">
          <div>
            <h2>{ar ? "تحتاج تحليل مخصص؟" : "Need custom analysis?"}</h2>
            <p>{ar ? "دع AI يبني لك خطة رعاية مبنية على هذه البيانات." : "Let AI build you a sponsorship plan based on this market data."}</p>
          </div>
          <Link className="button button-primary" href={localePath(locale, "planner")}>
            {ar ? "ابدأ مع AI Planner" : "Start with AI Planner"} <Arrow size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
