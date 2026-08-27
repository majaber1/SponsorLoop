import { redirect } from "next/navigation";
import GrowthConsole from "@/components/admin/GrowthConsole";
import { databaseEnabled } from "@/lib/db";
import { getGrowthDashboard } from "@/lib/growth-engine";
import { isLocale } from "@/lib/i18n";
import { getSession } from "@/lib/session";

export default async function GrowthPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const session = await getSession();
  if (databaseEnabled && session?.role !== "admin") redirect(`/${locale}/auth/sign-in`);
  const initial = await getGrowthDashboard();
  return <section className="page-section"><div className="container"><GrowthConsole initial={initial} ar={locale === "ar"} /></div></section>;
}
