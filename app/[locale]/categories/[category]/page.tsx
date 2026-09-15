import Link from "next/link";
import { notFound } from "next/navigation";
import { OpportunityCard } from "@/components/opportunity-card";
import { isLocale, localePath } from "@/lib/i18n";
import { listOpportunities } from "@/lib/repository";
import { categoryMeta } from "@/lib/categories";
import type { OpportunityCategory } from "@/lib/types";

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; category: string }> }) {
  const { locale: raw, category } = await params;
  if (!isLocale(raw)) return null;

  const meta = categoryMeta.find((c) => c.slug === category);
  if (!meta) notFound();

  const ar = raw === "ar";
  const items = await listOpportunities({ category: category as OpportunityCategory });

  const totalReach = items.reduce((s, o) => s + o.estimatedReach, 0);
  const avgPrice = items.length > 0 ? Math.round(items.reduce((s, o) => s + o.startingPrice, 0) / items.length) : 0;

  return (
    <section className="page-section">
      <div className="container">
        <Link className="back-link" href={localePath(raw, "categories")}>← {ar ? "التصنيفات" : "Categories"}</Link>

        <div className="page-title" style={{ marginTop: 16 }}>
          <span className="eyebrow">{ar ? meta.nameAr : meta.nameEn}</span>
          <h1>{ar ? meta.descriptionAr : meta.descriptionEn}</h1>
        </div>

        <div className="category-detail-stats">
          <div className="kpi-card panel">
            <small>{ar ? "الفرص المتاحة" : "Available Opportunities"}</small>
            <strong>{items.length}</strong>
          </div>
          <div className="kpi-card panel">
            <small>{ar ? "إجمالي الوصول" : "Total Reach"}</small>
            <strong>{totalReach.toLocaleString()}</strong>
          </div>
          <div className="kpi-card panel">
            <small>{ar ? "متوسط السعر" : "Average Price"}</small>
            <strong>{avgPrice.toLocaleString()} <em>SAR</em></strong>
          </div>
        </div>

        {items.length > 0 ? (
          <div className="opportunity-grid" style={{ marginTop: 28 }}>
            {items.map((item) => (
              <OpportunityCard key={item.id} item={item} locale={raw} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>{ar ? "لا توجد فرص حاليًا في هذا التصنيف" : "No opportunities in this category yet"}</h3>
            <p>{ar ? "ستظهر الفرص بمجرد إضافتها." : "Opportunities will appear once listed."}</p>
            <Link className="button button-primary" href={localePath(raw, "opportunities/new")} style={{ marginTop: 16 }}>
              {ar ? "أضف فرصة" : "List an opportunity"}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
