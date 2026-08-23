import { redirect } from "next/navigation";
import { Shield, Chart, Building } from "@/components/icons";
import { VerifyActions } from "@/components/admin-verify-actions";
import { isLocale } from "@/lib/i18n";
import { listDeals, listOpportunities } from "@/lib/repository";
import { getSession } from "@/lib/session";
import { databaseEnabled } from "@/lib/db";
import type { Locale } from "@/lib/types";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const ar = locale === "ar";
  const session = await getSession();
  if (databaseEnabled && session?.role !== "admin") redirect(`/${locale}/auth/sign-in`);
  const [deals, opps] = await Promise.all([listDeals(undefined, true), listOpportunities()]);
  const pending = opps.filter((x) => !x.verified);
  const verified = opps.filter((x) => x.verified);
  const stages = ["request", "negotiation", "approval", "contract", "payment", "delivery", "completed"];
  const stageCounts = stages.map((s) => ({ stage: s, count: deals.filter((d) => d.stage === s).length }));

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-title">
          <span className="eyebrow">Operations</span>
          <h1>{ar ? "لوحة التشغيل والإشراف" : "Operations & Moderation"}</h1>
          <p>{ar ? "منظور مركزي للثقة والمخزون والصفقات." : "Central view of trust, inventory and deals."}</p>
        </div>

        <div className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-icon"><Building /></span>
            <small>{ar ? "إجمالي الفرص" : "Total Opportunities"}</small>
            <strong>{opps.length}</strong>
          </div>
          <div className="kpi-card accent">
            <span className="kpi-icon"><Shield /></span>
            <small>{ar ? "تحتاج تحقق" : "Pending Verification"}</small>
            <strong>{pending.length}</strong>
          </div>
          <div className="kpi-card">
            <span className="kpi-icon"><Chart /></span>
            <small>{ar ? "الصفقات النشطة" : "Active Deals"}</small>
            <strong>{deals.length}</strong>
          </div>
          <div className="kpi-card">
            <span className="kpi-icon"><Shield /></span>
            <small>{ar ? "تم التحقق" : "Verified"}</small>
            <strong>{verified.length}</strong>
          </div>
        </div>

        <div className="panel table-panel">
          <div className="panel-head">
            <div>
              <strong>{ar ? "طابور التحقق" : "Verification Queue"}</strong>
              <small>{ar ? "راجع وقرر — قبول أو رفض كل فرصة" : "Review and decide — approve or reject each opportunity"}</small>
            </div>
          </div>
          {pending.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", opacity: 0.6 }}>
              {ar ? "لا توجد فرص معلقة — جميع الفرص تم التحقق منها" : "No pending items — all opportunities are verified"}
            </div>
          ) : (
            <div className="inventory-table">
              {pending.map((i) => (
                <div key={i.id}>
                  <div>
                    <strong>{ar ? i.titleAr : i.titleEn}</strong>
                    <small>{ar ? i.organizationNameAr : i.organizationNameEn}</small>
                  </div>
                  <span className="badge">{i.category}</span>
                  <span>{i.city}</span>
                  <span>{i.startingPrice.toLocaleString()} SAR</span>
                  <VerifyActions locale={locale as Locale} opportunityId={i.id} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel table-panel" style={{ marginTop: "1.5rem" }}>
          <div className="panel-head">
            <div>
              <strong>{ar ? "ملخص مراحل الصفقات" : "Deal Pipeline Summary"}</strong>
              <small>{ar ? "توزيع الصفقات حسب المرحلة" : "Deal distribution by stage"}</small>
            </div>
          </div>
          <div className="kpi-grid" style={{ padding: "1.5rem" }}>
            {stageCounts.map((s) => (
              <div key={s.stage} className="kpi-card compact">
                <small style={{ textTransform: "capitalize" }}>{s.stage}</small>
                <strong>{s.count}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="panel table-panel" style={{ marginTop: "1.5rem" }}>
          <div className="panel-head">
            <div>
              <strong>{ar ? "سجل الصفقات" : "All Deals"}</strong>
              <small>{ar ? "جميع الصفقات في المنصة" : "All platform deals"}</small>
            </div>
          </div>
          <div className="inventory-table">
            {deals.map((d) => (
              <div key={d.id}>
                <div>
                  <strong>{d.title}</strong>
                  <small>{d.counterparty}</small>
                </div>
                <span className="badge">{d.stage}</span>
                <span>{d.amount.toLocaleString()} {d.currency}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
