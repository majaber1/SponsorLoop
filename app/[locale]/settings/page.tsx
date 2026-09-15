import { redirect } from "next/navigation";
import { isLocale, localePath } from "@/lib/i18n";
import { getSession } from "@/lib/session";
import { getUserSettings } from "@/lib/repository";
import { SettingsForm } from "@/components/settings-form";

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return null;
  const session = await getSession();
  if (!session) redirect(localePath(raw, "auth/sign-in"));

  const settings = await getUserSettings(session.id);
  if (!settings) redirect(localePath(raw, "auth/sign-in"));

  const ar = raw === "ar";

  return (
    <section className="page-section">
      <div className="container narrow">
        <div className="page-title">
          <span className="eyebrow">{ar ? "الإعدادات" : "Settings"}</span>
          <h1>{ar ? "إعدادات الحساب" : "Account Settings"}</h1>
          <p>{ar ? "إدارة ملفك الشخصي وتفضيلات الإشعارات." : "Manage your profile and notification preferences."}</p>
        </div>
        <SettingsForm locale={raw} settings={settings} />
      </div>
    </section>
  );
}
