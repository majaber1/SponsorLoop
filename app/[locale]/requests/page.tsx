import Link from "next/link";
import { Arrow, Clock, MapPin, Megaphone, Users } from "@/components/icons";
import { isLocale, localePath } from "@/lib/i18n";
import { listSponsorshipRequests } from "@/lib/repository";

const categoryLabel: Record<string, { ar: string; en: string }> = {
  events: { ar: "فعاليات", en: "Events" }, creators: { ar: "صناع محتوى", en: "Creators" },
  podcasts: { ar: "بودكاست", en: "Podcasts" }, sports: { ar: "رياضة", en: "Sports" },
  athletes: { ar: "رياضيون", en: "Athletes" }, hackathons: { ar: "هاكاثونات", en: "Hackathons" },
  clubs: { ar: "أندية", en: "Clubs" }, digital: { ar: "رقمي", en: "Digital" },
  ooh: { ar: "خارجي", en: "OOH" }, community: { ar: "مجتمعات", en: "Communities" },
  gaming: { ar: "Gaming", en: "Gaming" }
};

export default async function RequestsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const ar = locale === "ar";
  const requests = await listSponsorshipRequests();

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-title">
          <span className="eyebrow"><Megaphone size={16} />{ar ? "السوق العكسي" : "Reverse Marketplace"}</span>
          <h1>{ar ? "جهات تبحث عن رعاة" : "Rights Holders Seeking Sponsors"}</h1>
          <p>
            {ar
              ? "هذه الجهات تبحث عن شركات ترعاها. إذا كنت علامة تجارية، استعرض الطلبات وتواصل مع الجهة المناسبة."
              : "These rights holders are actively seeking sponsors. If you're a brand, browse requests and connect with the right partner."}
          </p>
        </div>

        <div className="requests-grid">
          {requests.map((req) => (
            <div className="request-card panel" key={req.id}>
              <div className="request-top">
                <span className={`category-chip cover-${req.category}`}>
                  {categoryLabel[req.category]?.[locale] ?? req.category}
                </span>
                <span className={`status-pill status-${req.status}`}>
                  {req.status === "open" ? (ar ? "مفتوح" : "Open") : req.status === "matched" ? (ar ? "تم التوصيل" : "Matched") : (ar ? "مغلق" : "Closed")}
                </span>
              </div>
              <h3>{ar ? req.titleAr : req.titleEn}</h3>
              <p>{ar ? req.descriptionAr : req.descriptionEn}</p>
              <div className="request-meta">
                <span><MapPin size={14} />{req.city}</span>
                <span><Users size={14} />{req.audienceSize.toLocaleString()} {ar ? "وصول" : "reach"}</span>
                <span><Clock size={14} />{new Date(req.createdAt).toLocaleDateString(ar ? "ar-SA" : "en-US")}</span>
              </div>
              <div className="request-footer">
                <div className="request-budget">
                  <small>{ar ? "الميزانية المتوقعة" : "Expected budget"}</small>
                  <strong>{req.budgetRange}</strong>
                </div>
                <strong>{ar ? req.organizationNameAr : req.organizationNameEn}</strong>
              </div>
              <Link className="button button-primary full" href={localePath(locale, "campaigns/new")}>
                {ar ? "أبدِ اهتمامك" : "Express Interest"} <Arrow size={16} />
              </Link>
            </div>
          ))}
        </div>

        <div className="requests-cta panel">
          <div>
            <h2>{ar ? "عندك جمهور وتبحث عن راعٍ؟" : "Have an audience and seeking a sponsor?"}</h2>
            <p>{ar ? "أنشئ طلب رعاية ودع العلامات التجارية تجدك." : "Create a sponsorship request and let brands find you."}</p>
          </div>
          <Link className="button button-primary" href={localePath(locale, "requests/new")}>
            {ar ? "أنشئ طلب رعاية" : "Create Sponsorship Request"} <Arrow size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
