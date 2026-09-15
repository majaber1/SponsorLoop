import Link from "next/link";
import { notFound } from "next/navigation";
import { OpportunityCard } from "@/components/opportunity-card";
import { Shield, Chart, Check } from "@/components/icons";
import { isLocale, localePath } from "@/lib/i18n";
import { getOrganizationProfile } from "@/lib/repository";

export default async function OrgProfilePage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: raw, id } = await params;
  if (!isLocale(raw)) return null;
  const org = await getOrganizationProfile(id);
  if (!org) notFound();
  const ar = raw === "ar";

  const orgTypeLabels: Record<string, { ar: string; en: string }> = {
    brand: { ar: "علامة تجارية", en: "Brand" },
    rights_holder: { ar: "صاحب حقوق", en: "Rights Holder" },
    creator: { ar: "صانع محتوى", en: "Creator" },
    agency: { ar: "وكالة", en: "Agency" },
    community: { ar: "مجتمع", en: "Community" },
    media: { ar: "إعلام", en: "Media" },
    other: { ar: "أخرى", en: "Other" }
  };

  return (
    <section className="page-section">
      <div className="container">
        <Link className="back-link" href={localePath(raw, "marketplace")}>← {ar ? "السوق" : "Marketplace"}</Link>

        <div className="org-profile-header">
          <div className="org-avatar-large">
            <span>{org.nameEn.slice(0, 2).toUpperCase()}</span>
          </div>
          <div className="org-header-info">
            <div className="org-name-row">
              <h1>{ar ? org.nameAr : org.nameEn}</h1>
              {org.verificationStatus === "verified" && (
                <span className="org-verified-badge"><Shield size={16} /> {ar ? "موثّقة" : "Verified"}</span>
              )}
            </div>
            <p className="org-type-label">
              {orgTypeLabels[org.orgType]?.[ar ? "ar" : "en"] ?? org.orgType}
              {org.city && <> · {org.city}, {org.countryCode}</>}
            </p>
            {org.bio && <p className="org-bio">{org.bio}</p>}
          </div>
        </div>

        <div className="org-stats-grid">
          <div className="org-stat-card panel">
            <small>{ar ? "الفرص" : "Opportunities"}</small>
            <strong>{org.stats.totalOpportunities}</strong>
          </div>
          <div className="org-stat-card panel">
            <small>{ar ? "الصفقات" : "Deals"}</small>
            <strong>{org.stats.totalDeals}</strong>
          </div>
          <div className="org-stat-card panel">
            <small>{ar ? "التقييم" : "Rating"}</small>
            <strong>{org.stats.avgRating > 0 ? `${org.stats.avgRating}/5` : (ar ? "لا يوجد" : "N/A")}</strong>
          </div>
          <div className="org-stat-card panel">
            <small>{ar ? "إجمالي الوصول" : "Total Reach"}</small>
            <strong>{org.stats.totalReach.toLocaleString()}</strong>
          </div>
        </div>

        {org.opportunities.length > 0 && (
          <>
            <div className="section-head" style={{ marginTop: 40 }}>
              <div>
                <span className="eyebrow">{ar ? "الفرص المتاحة" : "Available Opportunities"}</span>
                <h2>{ar ? `فرص من ${org.nameAr}` : `Opportunities from ${org.nameEn}`}</h2>
              </div>
            </div>
            <div className="opportunity-grid">
              {org.opportunities.map((item) => (
                <OpportunityCard key={item.id} item={item} locale={raw} />
              ))}
            </div>
          </>
        )}

        {org.opportunities.length === 0 && (
          <div className="empty-state">
            <Chart size={40} />
            <h3>{ar ? "لا توجد فرص منشورة حاليًا" : "No published opportunities yet"}</h3>
            <p>{ar ? "ستظهر الفرص هنا بمجرد نشرها." : "Opportunities will appear here once published."}</p>
          </div>
        )}
      </div>
    </section>
  );
}
