"use client";

import { useState } from "react";
import type { Locale, UserSettings } from "@/lib/types";

export function SettingsForm({ locale, settings }: { locale: Locale; settings: UserSettings }) {
  const ar = locale === "ar";
  const [displayName, setDisplayName] = useState(settings.displayName);
  const [preferredLocale, setPreferredLocale] = useState(settings.locale);
  const [notifyDeals, setNotifyDeals] = useState(settings.notifyDeals);
  const [notifyMatches, setNotifyMatches] = useState(settings.notifyMatches);
  const [notifySystem, setNotifySystem] = useState(settings.notifySystem);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, locale: preferredLocale })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave}>
      <div className="panel form-card">
        <h2 style={{ fontSize: 18, margin: "0 0 20px" }}>{ar ? "الملف الشخصي" : "Profile"}</h2>

        <div className="form-grid">
          <div className="field">
            <span>{ar ? "الاسم" : "Display Name"}</span>
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
          </div>
          <div className="field">
            <span>{ar ? "البريد الإلكتروني" : "Email"}</span>
            <input value={settings.email} disabled style={{ opacity: 0.6 }} />
          </div>
          <div className="field">
            <span>{ar ? "المنظمة" : "Organization"}</span>
            <input value={settings.organizationName} disabled style={{ opacity: 0.6 }} />
          </div>
          <div className="field">
            <span>{ar ? "اللغة المفضلة" : "Preferred Language"}</span>
            <select value={preferredLocale} onChange={(e) => setPreferredLocale(e.target.value as Locale)}>
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      <div className="panel form-card" style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 18, margin: "0 0 20px" }}>{ar ? "تفضيلات الإشعارات" : "Notification Preferences"}</h2>

        <div className="settings-toggle-list">
          <label className="settings-toggle">
            <div>
              <strong>{ar ? "تحديثات الصفقات" : "Deal Updates"}</strong>
              <small>{ar ? "إشعار عند تغيير حالة الصفقة" : "Notify when deal status changes"}</small>
            </div>
            <input type="checkbox" checked={notifyDeals} onChange={(e) => setNotifyDeals(e.target.checked)} />
          </label>
          <label className="settings-toggle">
            <div>
              <strong>{ar ? "فرص مطابقة" : "New Matches"}</strong>
              <small>{ar ? "إشعار عند وجود فرصة مطابقة لحملتك" : "Notify when opportunities match your campaign"}</small>
            </div>
            <input type="checkbox" checked={notifyMatches} onChange={(e) => setNotifyMatches(e.target.checked)} />
          </label>
          <label className="settings-toggle">
            <div>
              <strong>{ar ? "إشعارات النظام" : "System Notifications"}</strong>
              <small>{ar ? "تحديثات المنصة والأخبار" : "Platform updates and announcements"}</small>
            </div>
            <input type="checkbox" checked={notifySystem} onChange={(e) => setNotifySystem(e.target.checked)} />
          </label>
        </div>
      </div>

      <div className="form-footer" style={{ marginTop: 16 }}>
        {error && <span className="error-text">{error}</span>}
        {saved && <span className="form-status">{ar ? "تم الحفظ بنجاح" : "Saved successfully"}</span>}
        <button type="submit" className="button button-primary" disabled={saving}>
          {saving ? (ar ? "جاري الحفظ..." : "Saving...") : (ar ? "حفظ الإعدادات" : "Save Settings")}
        </button>
      </div>
    </form>
  );
}
