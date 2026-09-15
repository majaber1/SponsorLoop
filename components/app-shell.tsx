import Link from "next/link";
import { databaseEnabled } from "@/lib/db";
import { dictionary, localePath } from "@/lib/i18n";
import { getSession } from "@/lib/session";
import type { Locale } from "@/lib/types";
import { BarChart, Globe, Grid, Layers, Megaphone, Settings, Shield, Sparkles, TrendingUp, User } from "./icons";
import { NotificationBell } from "./notification-bell";

export async function AppShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const t = dictionary[locale];
  const session = await getSession();
  const otherLocale: Locale = locale === "ar" ? "en" : "ar";
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container nav-wrap">
          <Link className="brand" href={localePath(locale)}>
            <span className="brand-mark"><span>S</span></span>
            <span><strong>SponsorLoop</strong><small>{t.tagline}</small></span>
          </Link>
          <nav className="main-nav" aria-label="Primary">
            <Link href={localePath(locale, "marketplace")}>{t.nav.marketplace}</Link>
            <Link href={localePath(locale, "planner")}><Sparkles size={16}/>{t.nav.planner}</Link>
            <Link href={localePath(locale, "deals")}>{t.nav.deals}</Link>
            <Link href={localePath(locale, "requests")}><Megaphone size={16}/>{locale === "ar" ? "طلبات رعاية" : "Requests"}</Link>
            <Link href={localePath(locale, "analytics")}><BarChart size={16}/>{locale === "ar" ? "التحليلات" : "Analytics"}</Link>
            <Link href={localePath(locale, "insights")}><TrendingUp size={16}/>{locale === "ar" ? "رؤى السوق" : "Insights"}</Link>
            <Link href={localePath(locale, "compare")}><Layers size={16}/>{locale === "ar" ? "قارن" : "Compare"}</Link>
            <Link href={localePath(locale, "categories")}><Grid size={16}/>{t.nav.categories}</Link>
            <Link href={localePath(locale, "compliance")}>{t.nav.compliance}</Link>
            <Link href={localePath(locale, "pricing")}>{t.nav.pricing}</Link>
          </nav>
          <div className="nav-actions">
            {!databaseEnabled && <span className="demo-badge"><span className="pulse-dot"/>{t.common.demo}</span>}
            <NotificationBell locale={locale} />
            <Link className="icon-button" href={localePath(otherLocale)} aria-label="Switch language"><Globe size={18}/><span>{otherLocale.toUpperCase()}</span></Link>
            {session ? (
              <>
                <Link className="icon-button" href={localePath(locale, "settings")} aria-label={t.nav.settings}><Settings size={18}/></Link>
                <Link className="profile-pill" href={localePath(locale, "dashboard")}><span className="avatar">{session.name.slice(0,1)}</span><span>{session.name}</span></Link>
              </>
            ) : (
              <Link className="button button-ghost compact" href={localePath(locale, "auth/sign-in")}><User size={17}/>{t.common.signIn}</Link>
            )}
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <div className="brand footer-brand"><span className="brand-mark"><span>S</span></span><span><strong>SponsorLoop</strong><small>{t.tagline}</small></span></div>
            <p>{locale === "ar" ? "منصة سعودية تربط العلامات التجارية بأفضل فرص الرعاية والإعلان، من الاكتشاف إلى القياس." : "A Saudi-first marketplace connecting brands with high-fit sponsorship and advertising opportunities, from discovery to measurement."}</p>
          </div>
          <div><strong>{locale === "ar" ? "المنتج" : "Product"}</strong><Link href={localePath(locale,"marketplace")}>{t.nav.marketplace}</Link><Link href={localePath(locale,"categories")}>{t.nav.categories}</Link><Link href={localePath(locale,"planner")}>{t.nav.planner}</Link><Link href={localePath(locale,"requests")}>{locale === "ar" ? "طلبات رعاية" : "Sponsorship Requests"}</Link><Link href={localePath(locale,"analytics")}>{locale === "ar" ? "التحليلات" : "Analytics"}</Link><Link href={localePath(locale,"insights")}>{locale === "ar" ? "رؤى السوق" : "Market Insights"}</Link><Link href={localePath(locale,"compare")}>{locale === "ar" ? "المقارنة" : "Compare"}</Link><Link href={localePath(locale,"pricing")}>{t.nav.pricing}</Link></div>
          <div><strong>{locale === "ar" ? "الثقة" : "Trust"}</strong><Link href={localePath(locale,"compliance")}><Shield size={15}/>{t.nav.compliance}</Link><span>{locale === "ar" ? "تحقق الجهات" : "Organization verification"}</span><span>{locale === "ar" ? "سجل تدقيق" : "Audit trail"}</span></div>
        </div>
        <div className="container footer-bottom"><span>© 2026 SponsorLoop</span><span>{locale === "ar" ? "مصمم للسعودية، قابل للتوسع خليجيًا" : "Built for Saudi Arabia, ready for the GCC"}</span></div>
      </footer>
    </div>
  );
}
