import Link from "next/link";
import { redirect } from "next/navigation";
import { Shield, Chart, Building } from "@/components/icons";
import { isLocale } from "@/lib/i18n";
import { listDeals, listOpportunities } from "@/lib/repository";
import { getSession } from "@/lib/session";
import { databaseEnabled } from "@/lib/db";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const ar = locale === "ar";
  const session = await getSession();
  if (databaseEnabled && session?.role !== "admin") redirect(`/${locale}/auth/sign-in`);

  const [deals, opps] = await Promise.all([listDeals(undefined, true), listOpportunities()]);
  const pending = opps.filter((x) => !x.verified).length;

  return <section className="page-section"><div className="container">
    <div className="page-title">
      <span className="eyebrow">Operations</span>
      <h1>{ar ? "لوحة التشغيل والإشراف" : "Operations & moderation"}</h1>
      <p>{ar ? "منظور مركزي للثقة والمخزون والصفقات، مع مركز نمو مخصص لاكتساب الرعاة وصناع المحتوى." : "Central view of trust, inventory and deals, with a dedicated growth engine for sponsor and creator acquisition."}</p>
      <div style={{ marginTop: 16 }}>
        <Link href={`/${locale}/admin/growth`} className="button primary">{ar ? "فتح Growth Engine" : "Open Growth Engine"}</Link>
      </div>
    </div>

    <div className="kpi-grid">
      <div className="kpi-card"><span className="kpi-icon"><Building /></span><small>{ar ? "إجمالي الفرص" : "Total opportunities"}</small><strong>{opps.length}</strong></div>
      <div className="kpi-card"><span className="kpi-icon"><Shield /></span><small>{ar ? "تحتاج تحقق" : "Need verification"}</small><strong>{pending}</strong></div>
      <div className="kpi-card"><span className="kpi-icon"><Chart /></span><small>{ar ? "الصفقات" : "Deals"}</small><strong>{deals.length}</strong></div>
    </div>

    <div className="panel table-panel">
      <div className="panel-head"><div><strong>{ar ? "طابور التحقق" : "Verification queue"}</strong><small>{ar ? "لا يتم تحويل declared إلى verified دون دليل" : "Declared never becomes verified without evidence"}</small></div></div>
      <div className="inventory-table">
        {opps.filter((x) => !x.verified).map((i) => <div key={i.id}><div><strong>{ar ? i.titleAr : i.titleEn}</strong><small>{i.organizationNameEn}</small></div><span>{i.category}</span><span>{i.city}</span><b>{ar ? "قيد التحقق" : "Pending"}</b></div>)}
      </div>
    </div>
  </div></section>;
}
