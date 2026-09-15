import Link from "next/link";
import { notFound } from "next/navigation";
import { StartDealButton } from "@/components/start-deal-button";
import { ROICalculator } from "@/components/roi-calculator";
import { PackageDisplay } from "@/components/package-manager";
import { Check, Phone, Shield } from "@/components/icons";
import { isLocale, localePath } from "@/lib/i18n";
import { getOpportunity, listPackages } from "@/lib/repository";

export default async function OpportunityPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: raw, id } = await params;
  if (!isLocale(raw)) return null;
  const item = await getOpportunity(id);
  if (!item) notFound();
  const ar = raw === "ar";
  const packages = await listPackages(id);
  const cpm = item.estimatedReach > 0 ? ((item.startingPrice / item.estimatedReach) * 1000).toFixed(1) : "—";

  return (
    <section className="page-section">
      <div className="container opportunity-detail">
        <div className="detail-main">
          <Link className="back-link" href={localePath(raw, "marketplace")}>← {ar ? "السوق" : "Marketplace"}</Link>
          <div className={`detail-cover cover-${item.category}`}>
            <div className="cover-monogram large">{item.organizationNameEn.slice(0, 2).toUpperCase()}</div>
          </div>
          <div className="detail-owner">
            <Link href={localePath(raw, `org/${item.organizationId}`)} className="text-link">{ar ? item.organizationNameAr : item.organizationNameEn}</Link>
            {item.verified && <b><Shield size={15} />{ar ? "موثّق" : "Verified"}</b>}
          </div>
          <h1>{ar ? item.titleAr : item.titleEn}</h1>
          <p className="lead">{ar ? item.descriptionAr : item.descriptionEn}</p>

          <div className="detail-section">
            <h2>{ar ? "الجمهور" : "Audience"}</h2>
            <div className="tag-row">{item.audience.map(x => <span className="soft-tag" key={x}>{x}</span>)}</div>
          </div>

          <div className="detail-section">
            <h2>{ar ? "ما الذي تحصل عليه" : "Available formats"}</h2>
            <div className="entitlements">{item.formats.map(x => <div key={x}><Check size={17} /><span>{x}</span></div>)}</div>
          </div>

          <div className="detail-section">
            <h2>{ar ? "الثقة والبيانات" : "Trust & data"}</h2>
            <div className="data-grid">
              <div><small>{ar ? "Trust score" : "Trust score"}</small><strong>{item.trustScore}/100</strong></div>
              <div><small>{ar ? "الأداء التاريخي" : "Performance"}</small><strong>{item.performanceScore}/100</strong></div>
              <div><small>{ar ? "التوافر" : "Availability"}</small><strong>{item.availabilityScore}/100</strong></div>
              <div><small>CPM</small><strong>{cpm} SAR</strong></div>
            </div>
          </div>

          <PackageDisplay locale={raw} packages={packages} />

          <ROICalculator locale={raw} opportunity={item} />
        </div>

        <aside className="booking-card panel">
          <span className="eyebrow">{ar ? "حجز / طلب عرض" : "Book / Request"}</span>
          <div className="booking-price">
            <small>{ar ? "ابتداءً من" : "Starting from"}</small>
            <strong>{item.startingPrice.toLocaleString()} <span>SAR</span></strong>
          </div>
          <div className="booking-stat"><span>{ar ? "وصول تقديري" : "Estimated reach"}</span><b>{item.estimatedReach.toLocaleString()}</b></div>
          <div className="booking-stat"><span>{ar ? "المدينة" : "City"}</span><b>{item.city}</b></div>
          <div className="booking-stat"><span>CPM</span><b>{cpm} SAR</b></div>
          <div className="booking-stat"><span>{ar ? "حالة التحقق" : "Verification"}</span><b className={item.verified ? "status-good" : ""}>{item.verified ? (ar ? "موثّقة" : "Verified") : (ar ? "قيد التحقق" : "Pending")}</b></div>
          <StartDealButton locale={raw} opportunityId={item.id} amount={item.startingPrice} />
          <a className="button button-whatsapp full" href="https://wa.me/966500000000" target="_blank" rel="noopener noreferrer">
            <Phone size={16} />
            {ar ? "تواصل عبر واتساب" : "Contact via WhatsApp"}
          </a>
          <p className="fine-print">{ar ? "إنشاء الصفقة لا يعني الخصم أو الدفع. تبدأ أولًا مرحلة الطلب والتفاوض." : "Starting a deal does not charge you. It opens the request and negotiation stage first."}</p>
        </aside>
      </div>
    </section>
  );
}
