import Link from "next/link";
import { isLocale, localePath } from "@/lib/i18n";
import { getCategoryStats } from "@/lib/repository";

export default async function CategoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return null;
  const ar = raw === "ar";
  const categories = await getCategoryStats();

  const coverClass: Record<string, string> = {
    events: "cover-events", creators: "cover-creators", podcasts: "cover-podcasts",
    sports: "cover-sports", digital: "cover-digital", ooh: "cover-ooh",
    community: "cover-community", gaming: "cover-gaming", athletes: "cover-athletes",
    hackathons: "cover-hackathons", clubs: "cover-clubs"
  };

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-title centered">
          <span className="eyebrow">{ar ? "التصنيفات" : "Categories"}</span>
          <h1>{ar ? "استكشف فرص الرعاية حسب التصنيف" : "Explore Sponsorship by Category"}</h1>
          <p>{ar ? "اختر التصنيف الأنسب لحملتك واكتشف الفرص المتاحة في كل مجال." : "Choose the category that fits your campaign and discover available opportunities."}</p>
        </div>

        <div className="category-browse-grid">
          {categories.map((cat) => (
            <Link key={cat.slug} href={localePath(raw, `categories/${cat.slug}`)} className="category-browse-card panel">
              <div className={`category-browse-cover ${coverClass[cat.slug] ?? ""}`}>
                <span className="cover-monogram">{cat.nameEn.slice(0, 2).toUpperCase()}</span>
              </div>
              <div className="category-browse-body">
                <h3>{ar ? cat.nameAr : cat.nameEn}</h3>
                <p>{ar ? cat.descriptionAr : cat.descriptionEn}</p>
                <div className="category-browse-stats">
                  <span><strong>{cat.count}</strong> {ar ? "فرصة" : "opportunities"}</span>
                  <span><strong>{cat.totalReach.toLocaleString()}</strong> {ar ? "وصول" : "reach"}</span>
                  {cat.avgPrice > 0 && <span>{ar ? "متوسط" : "avg"} <strong>{cat.avgPrice.toLocaleString()} SAR</strong></span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
