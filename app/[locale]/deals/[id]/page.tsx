import { notFound } from "next/navigation";
import { DealStageClient } from "@/components/deal-stage-client";
import { DealMessages } from "@/components/deal-messages";
import { ProposalBuilder } from "@/components/proposal-builder";
import { DeliverablesTracker } from "@/components/deliverables-tracker";
import { Shield, Check, Star } from "@/components/icons";
import { isLocale } from "@/lib/i18n";
import { listDeals } from "@/lib/repository";
import { getSession } from "@/lib/session";
import type { Locale } from "@/lib/types";

export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  if (!isLocale(locale)) return null;
  const ar = locale === "ar";
  const session = await getSession();
  const deal = (await listDeals(session?.organizationId, session?.role === "admin")).find((d) => d.id === id);
  if (!deal) notFound();
  const isCompleted = deal.stage === "completed";
  const showDeliverables = ["contract", "payment", "delivery", "completed"].includes(deal.stage);

  return (
    <section className="page-section">
      <div className="container narrow-wide">
        <div className="page-title">
          <span className="eyebrow">Deal #{deal.id.slice(-6)}</span>
          <h1>{deal.title}</h1>
          <p>{ar ? "غرفة الصفقة — إدارة العروض والتسليمات والتواصل" : "Deal Room — manage proposals, deliverables and communication"}</p>
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
              <small>{ar ? "الحالة الحالية" : "Current Stage"}</small>
              <strong className={`stage-pill stage-${deal.stage}`}>{deal.stage}</strong>
            </div>
          </div>
          <DealStageClient locale={locale as Locale} id={deal.id} initial={deal.stage} />

          <div className="deal-room-grid">
            <div className="deal-room-main">
              <ProposalBuilder locale={locale as Locale} dealAmount={deal.amount} />

              {showDeliverables && <DeliverablesTracker locale={locale as Locale} />}

              <div className="deal-sections">
                <div className="deal-box">
                  <span className="deal-box-icon"><Shield /></span>
                  <div>
                    <strong>{ar ? "العقد والدفع" : "Contract & Payment"}</strong>
                    <p>{ar ? "التوقيع والدفع محاكاة عرض — لا يتم دون مزود خارجي فعلي." : "Signature and payment are demo simulations — never marked successful without a real external provider."}</p>
                  </div>
                </div>
                {isCompleted && (
                  <div className="deal-box deal-box-review">
                    <span className="deal-box-icon"><Star /></span>
                    <div>
                      <strong>{ar ? "تقييم الشراكة" : "Partnership Review"}</strong>
                      <p>{ar ? "هذه الصفقة مكتملة. يمكنك تقييم الشريك." : "This deal is complete. Rate your partner to help the community."}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="deal-room-sidebar">
              <DealMessages locale={locale as Locale} dealId={deal.id} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
