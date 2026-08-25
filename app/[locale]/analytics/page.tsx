import Link from "next/link";
import { BarChart, Chart, Handshake, MapPin, Sparkles, Target, TrendingUp, Wallet } from "@/components/icons";
import { isLocale, localePath } from "@/lib/i18n";
import { listDeals, listOpportunities } from "@/lib/repository";
import { getSession } from "@/lib/session";

export default async function AnalyticsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const ar = locale === "ar";
  const session = await getSession();
  const [deals, opps] = await Promise.all([listDeals(session?.organizationId, session?.role === "admin"), listOpportunities()]);

  const totalPipeline = deals.reduce((s, d) => s + d.amount, 0);
  const completedRevenue = deals.filter((d) => d.stage === "completed").reduce((s, d) => s + d.amount, 0);
  const avgDealSize = deals.length ? Math.round(totalPipeline / deals.length) : 0;
  const conversionRate = deals.length ? Math.round((deals.filter((d) => d.stage === "completed").length / deals.length) * 100) : 0;

  const stageData = ["inquiry", "negotiation", "internal_approval", "contract_draft", "funding_pending", "live", "completed"] as const;
  const stageCounts = stageData.map((s) => ({ stage: s, count: deals.filter((d) => d.stage === s).length }));

  const categoryBreakdown = ["events", "creators", "podcasts", "sports", "digital", "ooh", "community", "gaming"] as const;
  const catCounts = categoryBreakdown.map((c) => ({ cat: c, count: opps.filter((o) => o.category === c).length }));
  const maxCat = Math.max(...catCounts.map((c) => c.count), 1);

  const cityBreakdown = opps.reduce<Record<string, number>>((acc, o) => { acc[o.city] = (acc[o.city] ?? 0) + 1; return acc; }, {});
  const cities = Object.entries(cityBreakdown).sort((a, b) => b[1] - a[1]);

  const avgTrust = Math.round(opps.reduce((s, o) => s + o.trustScore, 0) / Math.max(1, opps.length));
  const avgPerf = Math.round(opps.reduce((s, o) => s + o.performanceScore, 0) / Math.max(1, opps.length));
  const totalReach = opps.reduce((s, o) => s + o.estimatedReach, 0);

  return (
    <section className="page-section">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <span className="eyebrow"><BarChart size={16} /> Analytics</span>
            <h1>{ar ? "تحليلات الأداء والسوق" : "Performance & Market Analytics"}</h1>
            <p>{ar ? "نظرة شاملة على الصفقات والسوق والأداء مع رؤى قابلة للتنفيذ." : "Comprehensive view of deals, market and performance with actionable insights."}</p>
          </div>
          <div className="dashboard-actions">
            <Link className="button button-secondary" href={localePath(locale, "dashboard")}>{ar ? "لوحة التحكم" : "Dashboard"}</Link>
          </div>
        </div>

        {/* KPI Row */}
        <div className="kpi-grid kpi-5">
          <div className="kpi-card">
            <span className="kpi-icon"><Wallet /></span>
            <small>{ar ? "إجمالي قيمة الصفقات" : "Total Pipeline"}</small>
            <strong>{totalPipeline.toLocaleString()} <em>SAR</em></strong>
          </div>
          <div className="kpi-card">
            <span className="kpi-icon"><TrendingUp /></span>
            <small>{ar ? "إيراد مكتمل" : "Completed Revenue"}</small>
            <strong>{completedRevenue.toLocaleString()} <em>SAR</em></strong>
          </div>
          <div className="kpi-card">
            <span className="kpi-icon"><Handshake /></span>
            <small>{ar ? "متوسط حجم الصفقة" : "Avg Deal Size"}</small>
            <strong>{avgDealSize.toLocaleString()} <em>SAR</em></strong>
          </div>
          <div className="kpi-card">
            <span className="kpi-icon"><Target /></span>
            <small>{ar ? "معدل التحويل" : "Conversion Rate"}</small>
            <strong>{conversionRate}%</strong>
          </div>
          <div className="kpi-card">
            <span className="kpi-icon"><Chart /></span>
            <small>{ar ? "إجمالي الوصول" : "Total Reach"}</small>
            <strong>{(totalReach / 1000000).toFixed(1)}M</strong>
          </div>
        </div>

        <div className="analytics-grid">
          {/* Deal Pipeline */}
          <div className="panel analytics-panel">
            <div className="panel-head">
              <div>
                <strong>{ar ? "مسار الصفقات" : "Deal Pipeline"}</strong>
                <small>{ar ? "عدد الصفقات في كل مرحلة" : "Deals by stage"}</small>
              </div>
            </div>
            <div className="pipeline-chart">
              {stageCounts.map((s) => (
                <div key={s.stage} className="pipeline-bar-wrap">
                  <div className="pipeline-bar">
                    <div className={`pipeline-fill stage-fill-${s.stage}`} style={{ height: `${Math.max(8, (s.count / Math.max(...stageCounts.map((x) => x.count), 1)) * 100)}%` }} />
                  </div>
                  <small>{s.stage}</small>
                  <b>{s.count}</b>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="panel analytics-panel">
            <div className="panel-head">
              <div>
                <strong>{ar ? "توزيع الفئات" : "Category Breakdown"}</strong>
                <small>{ar ? "فرص حسب الفئة" : "Opportunities by category"}</small>
              </div>
            </div>
            <div className="cat-chart">
              {catCounts.map((c) => (
                <div key={c.cat} className="cat-row">
                  <span className="cat-label">{c.cat}</span>
                  <div className="cat-bar-track">
                    <div className="cat-bar-fill" style={{ width: `${(c.count / maxCat) * 100}%` }} />
                  </div>
                  <b>{c.count}</b>
                </div>
              ))}
            </div>
          </div>

          {/* City Distribution */}
          <div className="panel analytics-panel">
            <div className="panel-head">
              <div>
                <strong><MapPin size={16} /> {ar ? "التوزيع الجغرافي" : "Geographic Distribution"}</strong>
                <small>{ar ? "الفرص حسب المدينة" : "Opportunities by city"}</small>
              </div>
            </div>
            <div className="city-list">
              {cities.map(([city, count]) => (
                <div key={city} className="city-row">
                  <span>{city}</span>
                  <div className="city-bar-track">
                    <div className="city-bar-fill" style={{ width: `${(count / Math.max(cities[0]?.[1] ?? 1, 1)) * 100}%` }} />
                  </div>
                  <b>{count}</b>
                </div>
              ))}
            </div>
          </div>

          {/* Trust & Performance */}
          <div className="panel analytics-panel">
            <div className="panel-head">
              <div>
                <strong><Sparkles size={16} /> {ar ? "مؤشرات الجودة" : "Quality Metrics"}</strong>
                <small>{ar ? "متوسط الثقة والأداء" : "Average trust & performance"}</small>
              </div>
            </div>
            <div className="quality-metrics">
              <div className="quality-ring-wrap">
                <div className="quality-ring">
                  <svg viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--line)" strokeWidth="10" />
                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--green)" strokeWidth="10" strokeDasharray={`${avgTrust * 3.14} 314`} strokeLinecap="round" transform="rotate(-90 60 60)" />
                  </svg>
                  <div className="ring-value"><strong>{avgTrust}</strong><small>{ar ? "ثقة" : "Trust"}</small></div>
                </div>
              </div>
              <div className="quality-ring-wrap">
                <div className="quality-ring">
                  <svg viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--line)" strokeWidth="10" />
                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--gold)" strokeWidth="10" strokeDasharray={`${avgPerf * 3.14} 314`} strokeLinecap="round" transform="rotate(-90 60 60)" />
                  </svg>
                  <div className="ring-value"><strong>{avgPerf}</strong><small>{ar ? "أداء" : "Perf"}</small></div>
                </div>
              </div>
              <div className="quality-stats">
                <div><small>{ar ? "فرص موثقة" : "Verified"}</small><strong>{opps.filter((o) => o.verified).length}/{opps.length}</strong></div>
                <div><small>{ar ? "متوسط السعر" : "Avg price"}</small><strong>{Math.round(opps.reduce((s, o) => s + o.startingPrice, 0) / Math.max(1, opps.length)).toLocaleString()} SAR</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Opportunities */}
        <div className="panel analytics-panel" style={{ marginTop: 15 }}>
          <div className="panel-head">
            <div>
              <strong>{ar ? "أفضل الفرص أداءً" : "Top Performing Opportunities"}</strong>
              <small>{ar ? "بناءً على مجموع الثقة والأداء" : "Based on combined trust and performance scores"}</small>
            </div>
            <Link className="text-link" href={localePath(locale, "marketplace")}>{ar ? "عرض الكل" : "View all"}</Link>
          </div>
          <div className="inventory-table">
            {opps.sort((a, b) => (b.trustScore + b.performanceScore) - (a.trustScore + a.performanceScore)).slice(0, 5).map((i) => (
              <Link href={localePath(locale, `opportunities/${i.id}`)} key={i.id}>
                <div><strong>{ar ? i.titleAr : i.titleEn}</strong><small>{i.city} · {i.category}</small></div>
                <span>{i.estimatedReach.toLocaleString()} reach</span>
                <span>{i.startingPrice.toLocaleString()} SAR</span>
                <b>{Math.round((i.trustScore + i.performanceScore) / 2)}/100</b>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
