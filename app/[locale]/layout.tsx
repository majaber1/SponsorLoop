import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { isLocale } from "@/lib/i18n";

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body><AppShell locale={locale}>{children}</AppShell></body>
    </html>
  );
}
