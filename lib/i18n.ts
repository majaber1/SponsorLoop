import type { Locale } from "./types";

export const locales: Locale[] = ["ar", "en"];

export function isLocale(value: string): value is Locale {
  return value === "ar" || value === "en";
}

export const dictionary = {
  ar: {
    brand: "SponsorLoop",
    tagline: "الرعاية والإعلان بقرار أذكى",
    nav: {
      marketplace: "السوق",
      planner: "مخطط AI",
      dashboard: "لوحة التحكم",
      deals: "الصفقات",
      compliance: "الثقة والامتثال",
      pricing: "الأسعار"
    },
    common: {
      explore: "استكشف الفرص",
      list: "أضف فرصة",
      createCampaign: "أنشئ حملة",
      signIn: "دخول",
      signUp: "إنشاء حساب",
      save: "حفظ",
      startDeal: "ابدأ الصفقة",
      view: "عرض التفاصيل",
      sar: "ر.س",
      from: "ابتداءً من",
      verified: "موثّق",
      reach: "وصول تقديري",
      match: "تطابق",
      continue: "متابعة",
      back: "رجوع",
      demo: "وضع تجريبي"
    }
  },
  en: {
    brand: "SponsorLoop",
    tagline: "Smarter sponsorship and advertising decisions",
    nav: {
      marketplace: "Marketplace",
      planner: "AI Planner",
      dashboard: "Dashboard",
      deals: "Deals",
      compliance: "Trust & Compliance",
      pricing: "Pricing"
    },
    common: {
      explore: "Explore opportunities",
      list: "List an opportunity",
      createCampaign: "Create campaign",
      signIn: "Sign in",
      signUp: "Create account",
      save: "Save",
      startDeal: "Start deal",
      view: "View details",
      sar: "SAR",
      from: "From",
      verified: "Verified",
      reach: "Estimated reach",
      match: "match",
      continue: "Continue",
      back: "Back",
      demo: "Demo mode"
    }
  }
} as const;

export function localePath(locale: Locale, path = "") {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${path ? suffix : ""}`;
}
