import { redirect } from "next/navigation";
import { isLocale, localePath } from "@/lib/i18n";
import { getSession } from "@/lib/session";
import { OnboardingWizard } from "@/components/onboarding-wizard";

export default async function OnboardingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return null;
  const session = await getSession();
  if (!session) redirect(localePath(raw, "auth/sign-in"));

  const ar = raw === "ar";

  return (
    <section className="page-section">
      <div className="container narrow">
        <div className="page-title centered">
          <span className="eyebrow">{ar ? "مرحبًا بك" : "Welcome"}</span>
          <h1>{ar ? "أكمل إعداد حسابك" : "Complete Your Account Setup"}</h1>
          <p>{ar ? "بضع خطوات لتخصيص تجربتك على SponsorLoop." : "A few steps to personalize your SponsorLoop experience."}</p>
        </div>
        <OnboardingWizard locale={raw} userName={session.name} userRole={session.role} />
      </div>
    </section>
  );
}
