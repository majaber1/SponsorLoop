import Link from "next/link";
import { localePath } from "@/lib/i18n";
import type { Locale, Opportunity } from "@/lib/types";
import { Check, Chevron, Shield } from "./icons";
import { FavoriteButton } from "./favorite-button";

const categoryLabel = {
  ar: { events: "فعاليات", creators: "صناع محتوى", podcasts: "بودكاست وإعلام", sports: "رياضة", digital: "منصات رقمية", ooh: "إعلان خارجي", community: "جامعات ومجتمعات", gaming: "ألعاب ورياضات إلكترونية", athletes: "رياضيون أفراد", hackathons: "هاكاثونات ومسابقات", clubs: "أندية ومجتمعات" },
  en: { events: "Events", creators: "Creators", podcasts: "Podcasts & media", sports: "Sports", digital: "Digital platforms", ooh: "OOH", community: "Universities & communities", gaming: "Gaming & esports", athletes: "Athletes", hackathons: "Hackathons & competitions", clubs: "Clubs & societies" }
};

export function OpportunityCard({ locale, item, score, compact, favorited }: { locale: Locale; item: Opportunity; score?: number; compact?: boolean; favorited?: boolean }) {
  const ar = locale === "ar";

  if (compact) {
    return (
      <Link href={localePath(locale, `opportunities/${item.id}`)} className="opportunity-list-item">
        <div className={`list-item-badge cover-${item.category}`}>
          <span>{item.organizationNameEn.slice(0, 2).toUpperCase()}</span>
        </div>
        <div className="list-item-main">
          <div className="list-item-top">
            <strong>{ar ? item.titleAr : item.titleEn}</strong>
            {item.verified && <span className="verified-inline"><Shield size={13}/>{ar ? "موثّق" : "Verified"}</span>}
          </div>
          <small>{ar ? item.organizationNameAr : item.organizationNameEn} · {item.city} · {categoryLabel[locale][item.category]}</small>
        </div>
        <div className="list-item-metrics">
          <div><small>{ar ? "السعر" : "Price"}</small><strong>{item.startingPrice.toLocaleString()} SAR</strong></div>
          <div><small>{ar ? "الوصول" : "Reach"}</small><strong>{item.estimatedReach.toLocaleString()}</strong></div>
          <div><small>{ar ? "الثقة" : "Trust"}</small><strong>{item.trustScore}/100</strong></div>
        </div>
        <Chevron size={17} />
      </Link>
    );
  }

  return (
    <article className="opportunity-card">
      <div className={`opportunity-cover cover-${item.category}`}>
        <span className="category-chip">{categoryLabel[locale][item.category]}</span>
        {score != null && <span className="score-ring"><strong>{score}</strong><small>%</small></span>}
        <div className="cover-monogram">{item.organizationNameEn.slice(0, 2).toUpperCase()}</div>
        {item.featured && <span className="featured-badge">{ar ? "مميز" : "Featured"}</span>}
      </div>
      <div className="opportunity-body">
        <div className="owner-line"><span>{ar ? item.organizationNameAr : item.organizationNameEn}</span>{item.verified && <span className="verified-inline"><Shield size={14}/>{ar ? "موثّق" : "Verified"}</span>}</div>
        <h3>{ar ? item.titleAr : item.titleEn}</h3>
        <p>{ar ? item.descriptionAr : item.descriptionEn}</p>
        <div className="tag-row">
          <span className="soft-tag city-tag">{item.city}</span>
          {item.audience.slice(0,3).map((tag) => <span className="soft-tag" key={tag}>{tag}</span>)}
        </div>
        <div className="card-metrics">
          <div><small>{ar ? "ابتداءً من" : "From"}</small><strong>{item.startingPrice.toLocaleString(ar ? "ar-SA" : "en-US")} <span>{ar ? "ر.س" : "SAR"}</span></strong></div>
          <div><small>{ar ? "وصول تقديري" : "Est. reach"}</small><strong>{item.estimatedReach.toLocaleString(ar ? "ar-SA" : "en-US")}</strong></div>
        </div>
        <div className="card-footer">
          <Link className="card-link" href={localePath(locale, `opportunities/${item.id}`)}>{ar ? "عرض الفرصة" : "View opportunity"}<Chevron size={17}/></Link>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FavoriteButton opportunityId={item.id} initialFav={!!favorited} />
            <span className="trust-mini">{item.trustScore}/100</span>
          </span>
        </div>
      </div>
    </article>
  );
}
