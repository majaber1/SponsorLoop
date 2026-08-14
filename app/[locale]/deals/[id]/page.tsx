import { notFound } from "next/navigation";
import { DealStageClient } from "@/components/deal-stage-client";
import { DealMessages } from "@/components/deal-messages";
import { Shield, Check, Star } from "@/components/icons";
import { isLocale } from "@/lib/i18n";
import { listDeals } from "@/lib/repository";
import { getSession } from "@/lib/session";

export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  if (!isLocale(locale)) return null;
  const ar = locale === "ar";
  const session = await getSession();
  const deal = (await listDeals(session?.organizationId, session?.role === "admin")).find((d) => d.id === id);
  if (!deal) notFound();
  const isCompleted = deal.stage === "completed";

  return (
    <section className="page-section">
      <div className="container narrow-wide">
        <div className="page-title">
          <span className="eyebrow">Deal #{deal.id.slice(-6)}</span>
          <h1>{deal.title}</h1>
          <p>
            {ar
              ? "كل تغيير مرحلة يجب أن يعكس حدثًا حقيقيًا؛ لا يتم اعتبار الدفع أو التوقيع ناجحًا دون مزود خارجي فعلي."
              : "Stage changes must reflect real events; payment and signature are never marked successful without a real external provider."}
          </p>
        </div>
        <div className="panel deal-room">
          <div className="deal-summary">
            <div>
              <small>{ar ? "الطرف المقابل" : "Counterparty"}</small>
              <strong>{deal.counterparty}</strong>
            </div>
            <div>
              <small>{ar ? "القيمة" : "Value"}</small>
              <strong>{deal.amount.toLocaleString()} SAR</strong>
            </div>
            <div>
              <small>{ar ? "الحالة الحالية" : "Current stage"}</small>
              <strong className={`stage-pill stage-${deal.stage}`}>{deal.stage}</strong>
            </div>
          </div>
          <DealStageClient locale={locale} id={deal.id} initial={deal.stage} />

          {/* Deal Messages / Activity Timeline */}
          <DealMessages locale={locale} dealId={deal.id} />

          <div className="deal-sections">
            <div className="deal-box">
              <span className="deal-box-icon"><Check /></span>
              <div>
                <strong>{ar ? "العرض والشروط" : "Proposal & terms"}</strong>
                <p>
                  {ar
                    ? "المبلغ الحالي محفوظ مع الصفقة. النسخة الإنتاجية تحتفظ بإصدارات العرض وسجل من غيّرها."
                    : "The current amount is tied to the deal. Production mode keeps proposal versions and an audit history."}
                </p>
              </div>
            </div>
            <div className="deal-box">
              <span className="deal-box-icon"><Shield /></span>
              <div>
                <strong>{ar ? "العقد والدفع" : "Contract & payment"}</strong>
                <p>
                  {ar
                    ? "واجهات التكامل موجودة في الإعدادات، لكن المنصة لن تدّعي توقيعًا أو دفعًا دون مزود حقيقي."
                    : "Integration boundaries are configured, but SponsorLoop will not claim a signature or payment without a real provider."}
                </p>
              </div>
            </div>
            {isCompleted && (
              <div className="deal-box deal-box-review">
                <span className="deal-box-icon"><Star /></span>
                <div>
                  <strong>{ar ? "تقييم الشراكة" : "Partnership Review"}</strong>
                  <p>
                    {ar
                      ? "هذه الصفقة مكتملة. يمكنك تقييم الشريك لمساعدة المجتمع."
                      : "This deal is complete. Rate your partner to help the community."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
