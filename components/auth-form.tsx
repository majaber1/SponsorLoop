"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/types";

const demoAccounts = [
  { email: "demo@sponsorloop.sa", label: "Brand / Advertiser", labelAr: "معلن / علامة تجارية", icon: "🏢" },
  { email: "owner@sponsorloop.sa", label: "Rights Holder", labelAr: "مالك فرصة / حقوق", icon: "🎯" },
  { email: "agency@sponsorloop.sa", label: "Agency", labelAr: "وكالة", icon: "🏛️" },
  { email: "admin@sponsorloop.sa", label: "Admin", labelAr: "مشرف النظام", icon: "⚙️" },
];

export function AuthForm({ locale, mode }: { locale: Locale; mode: "sign-in" | "sign-up" }) {
  const ar = locale === "ar";
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: mode === "sign-in" ? "demo@sponsorloop.sa" : "",
    password: mode === "sign-in" ? "Demo123!" : "",
    name: "",
    organizationName: "",
    role: "advertiser",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const r = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await r.json();
      if (r.ok) {
        router.push(`/${locale}/dashboard`);
        router.refresh();
      } else {
        setError(j.error || "Error");
      }
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (email: string) => {
    setError("");
    setLoading(true);
    try {
      const r = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password: "Demo123!" }),
      });
      const j = await r.json();
      if (r.ok) {
        router.push(`/${locale}/dashboard`);
        router.refresh();
      } else {
        setError(j.error || "Error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-card panel" onSubmit={submit}>
      <div className="auth-brand">
        <span className="brand-mark"><span>S</span></span>
        <div>
          <strong>SponsorLoop</strong>
          <small>{ar ? "مساحة عمل الرعايات والإعلانات" : "Sponsorship & advertising workspace"}</small>
        </div>
      </div>
      <h1>{mode === "sign-in" ? (ar ? "مرحبًا بعودتك" : "Welcome back") : (ar ? "أنشئ مساحة عملك" : "Create your workspace")}</h1>
      <p>
        {mode === "sign-in"
          ? (ar ? "ادخل لإدارة الحملات والفرص والصفقات من مكان واحد." : "Sign in to manage campaigns, opportunities and deals in one place.")
          : (ar ? "اختر نوع الحساب؛ يمكنك إضافة أعضاء وفِرق لاحقًا." : "Choose your account type; teams can be added later.")}
      </p>

      {mode === "sign-up" && (
        <>
          <label className="field">
            <span>{ar ? "الاسم" : "Name"}</span>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="field">
            <span>{ar ? "المنشأة / الجهة" : "Organization"}</span>
            <input required value={form.organizationName} onChange={(e) => setForm({ ...form, organizationName: e.target.value })} />
          </label>
          <label className="field">
            <span>{ar ? "نوع الحساب" : "Account type"}</span>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="advertiser">{ar ? "معلن / علامة تجارية" : "Advertiser / Brand"}</option>
              <option value="owner">{ar ? "مالك فرصة / حقوق" : "Rights holder"}</option>
              <option value="agency">{ar ? "وكالة" : "Agency"}</option>
            </select>
          </label>
        </>
      )}
      <label className="field">
        <span>{ar ? "البريد الإلكتروني" : "Email"}</span>
        <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </label>
      <label className="field">
        <span>{ar ? "كلمة المرور" : "Password"}</span>
        <input type="password" minLength={8} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      </label>
      {error && <div className="error-box">{error}</div>}
      <button className="button button-primary full" disabled={loading}>
        {loading ? (ar ? "جارٍ..." : "Loading...") : mode === "sign-in" ? (ar ? "دخول" : "Sign in") : (ar ? "إنشاء الحساب" : "Create account")}
      </button>

      {mode === "sign-in" && (
        <div className="demo-accounts-section">
          <strong>{ar ? "دخول سريع تجريبي" : "Quick Demo Login"}</strong>
          <small>{ar ? "كلمة المرور: Demo123!" : "Password: Demo123!"}</small>
          <div className="demo-accounts-grid">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                className="demo-account-btn"
                onClick={() => quickLogin(acc.email)}
                disabled={loading}
              >
                <span className="demo-account-icon">{acc.icon}</span>
                <div>
                  <strong>{ar ? acc.labelAr : acc.label}</strong>
                  <small>{acc.email}</small>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
