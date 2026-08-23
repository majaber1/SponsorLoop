"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/types";
import { BarChart, Globe, Layers, Megaphone, Shield, Sparkles, TrendingUp, User, Wallet } from "./icons";

export function MobileMenuButton({ locale, isLoggedIn }: { locale: Locale; isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const ar = locale === "ar";
  const router = useRouter();
  const otherLocale: Locale = locale === "ar" ? "en" : "ar";

  const signOut = async () => {
    await fetch("/api/auth/sign-out", { method: "POST" });
    setOpen(false);
    router.push(`/${locale}`);
    router.refresh();
  };

  return (
    <>
      <button className="mobile-menu-btn" onClick={() => setOpen(true)} aria-label="Menu">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="5" x2="17" y2="5"/><line x1="3" y1="10" x2="17" y2="10"/><line x1="3" y1="15" x2="17" y2="15"/></svg>
      </button>
      {open && (
        <>
          <div className="mobile-nav-overlay" onClick={() => setOpen(false)} />
          <nav className="mobile-nav">
            <div className="mobile-nav-header">
              <strong>SponsorLoop</strong>
              <button className="mobile-nav-close" onClick={() => setOpen(false)}>✕</button>
            </div>
            <Link href={`/${locale}/marketplace`} onClick={() => setOpen(false)}>
              <Sparkles size={16} />{ar ? "السوق" : "Marketplace"}
            </Link>
            <Link href={`/${locale}/planner`} onClick={() => setOpen(false)}>
              <Sparkles size={16} />{ar ? "مخطط AI" : "AI Planner"}
            </Link>
            <Link href={`/${locale}/deals`} onClick={() => setOpen(false)}>
              <Wallet size={16} />{ar ? "الصفقات" : "Deals"}
            </Link>
            <Link href={`/${locale}/requests`} onClick={() => setOpen(false)}>
              <Megaphone size={16} />{ar ? "طلبات رعاية" : "Requests"}
            </Link>
            <Link href={`/${locale}/analytics`} onClick={() => setOpen(false)}>
              <BarChart size={16} />{ar ? "التحليلات" : "Analytics"}
            </Link>
            <Link href={`/${locale}/insights`} onClick={() => setOpen(false)}>
              <TrendingUp size={16} />{ar ? "رؤى السوق" : "Insights"}
            </Link>
            <Link href={`/${locale}/compare`} onClick={() => setOpen(false)}>
              <Layers size={16} />{ar ? "قارن" : "Compare"}
            </Link>
            <Link href={`/${locale}/compliance`} onClick={() => setOpen(false)}>
              <Shield size={16} />{ar ? "الثقة والامتثال" : "Trust & Compliance"}
            </Link>
            <Link href={`/${locale}/pricing`} onClick={() => setOpen(false)}>
              {ar ? "الأسعار" : "Pricing"}
            </Link>
            <div className="mobile-nav-divider" />
            {isLoggedIn ? (
              <>
                <Link href={`/${locale}/dashboard`} onClick={() => setOpen(false)}>
                  <User size={16} />{ar ? "لوحة التحكم" : "Dashboard"}
                </Link>
                <Link href={`/${locale}/dashboard/owner`} onClick={() => setOpen(false)}>
                  {ar ? "إدارة المخزون" : "Inventory Management"}
                </Link>
                <Link href={`/${locale}/admin`} onClick={() => setOpen(false)}>
                  {ar ? "الإدارة" : "Admin"}
                </Link>
                <div className="mobile-nav-divider" />
                <button className="button button-secondary full" onClick={signOut} style={{ marginTop: 4 }}>
                  {ar ? "تسجيل الخروج" : "Sign Out"}
                </button>
              </>
            ) : (
              <Link href={`/${locale}/auth/sign-in`} onClick={() => setOpen(false)}>
                <User size={16} />{ar ? "دخول" : "Sign In"}
              </Link>
            )}
            <div className="mobile-nav-divider" />
            <Link href={`/${otherLocale}`} onClick={() => setOpen(false)}>
              <Globe size={16} />{locale === "ar" ? "English" : "العربية"}
            </Link>
          </nav>
        </>
      )}
    </>
  );
}

export function SignOutButton({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const router = useRouter();
  const signOut = async () => {
    await fetch("/api/auth/sign-out", { method: "POST" });
    router.push(`/${locale}`);
    router.refresh();
  };
  return (
    <button className="button button-ghost compact" onClick={signOut} title={ar ? "خروج" : "Sign out"}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
    </button>
  );
}
