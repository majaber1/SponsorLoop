import { CreateRequestForm } from "@/components/create-request-form";
import { isLocale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const ar = locale === "ar";
  return (
    <section className="page-section">
      <div className="container narrow">
        <div className="page-title">
          <span className="eyebrow">{ar ? "طلب رعاية" : "Sponsorship Request"}</span>
          <h1>{ar ? "أنشئ طلب رعاية ودع العلامات التجارية تجدك" : "Create a sponsorship request and let brands find you"}</h1>
          <p>{ar ? "صِف مشروعك وجمهورك والميزانية المتوقعة. سنربطك بالرعاة المناسبين." : "Describe your project, audience and expected budget. We'll connect you with the right sponsors."}</p>
        </div>
        <CreateRequestForm locale={locale} />
      </div>
    </section>
  );
}
