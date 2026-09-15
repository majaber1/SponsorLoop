"use client";

import { useState } from "react";
import { Check } from "@/components/icons";
import type { Locale, PackageTier } from "@/lib/types";

export function PackageDisplay({ locale, packages }: { locale: Locale; packages: PackageTier[] }) {
  const ar = locale === "ar";
  if (packages.length === 0) return null;

  return (
    <div className="detail-section">
      <h2>{ar ? "باقات الرعاية" : "Sponsorship Packages"}</h2>
      <div className="packages-grid">
        {packages.map((pkg) => (
          <div key={pkg.id} className={`package-card panel ${packages.indexOf(pkg) === 0 ? "featured" : ""}`}>
            {packages.indexOf(pkg) === 0 && (
              <span className="recommended">{ar ? "الأكثر شعبية" : "Most Popular"}</span>
            )}
            <h3>{ar ? pkg.nameAr : pkg.nameEn}</h3>
            <div className="package-price">
              <strong>{pkg.price.toLocaleString()}</strong>
              <span>SAR</span>
            </div>
            {pkg.quantity !== undefined && (
              <small className="package-availability">
                {ar ? `${pkg.quantity} متاحة` : `${pkg.quantity} available`}
              </small>
            )}
            <div className="package-entitlements">
              {pkg.entitlements.map((e, i) => (
                <div key={i}><Check size={14} /><span>{e}</span></div>
              ))}
            </div>
            <span className={`status-pill ${pkg.status === "available" ? "status-open" : "status-closed"}`}>
              {pkg.status === "available" ? (ar ? "متاح" : "Available") : (ar ? "نفذ" : "Sold Out")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PackageEditor({ locale, opportunityId }: { locale: Locale; opportunityId: string }) {
  const ar = locale === "ar";
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [entitlements, setEntitlements] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId,
          nameAr,
          nameEn,
          price: Number(price),
          quantity: quantity ? Number(quantity) : undefined,
          entitlements: entitlements.split("\n").map((s) => s.trim()).filter(Boolean)
        })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create package");
      }
      setSaved(true);
      setNameAr("");
      setNameEn("");
      setPrice("");
      setQuantity("");
      setEntitlements("");
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="panel form-card" style={{ marginTop: 16 }}>
      <h3 style={{ fontSize: 16, margin: "0 0 16px" }}>{ar ? "إضافة باقة جديدة" : "Add New Package"}</h3>
      <div className="form-grid">
        <div className="field">
          <span>{ar ? "اسم الباقة (عربي)" : "Package Name (Arabic)"}</span>
          <input value={nameAr} onChange={(e) => setNameAr(e.target.value)} required placeholder={ar ? "الباقة الذهبية" : "Gold Package"} />
        </div>
        <div className="field">
          <span>{ar ? "اسم الباقة (إنجليزي)" : "Package Name (English)"}</span>
          <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} required placeholder="Gold Package" />
        </div>
        <div className="field">
          <span>{ar ? "السعر (ر.س)" : "Price (SAR)"}</span>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" />
        </div>
        <div className="field">
          <span>{ar ? "الكمية المتاحة (اختياري)" : "Available Quantity (optional)"}</span>
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" />
        </div>
        <div className="field span-2">
          <span>{ar ? "المزايا (سطر لكل ميزة)" : "Entitlements (one per line)"}</span>
          <textarea value={entitlements} onChange={(e) => setEntitlements(e.target.value)} rows={4} placeholder={ar ? "كل سطر يمثل ميزة واحدة" : "Each line is one entitlement"} />
        </div>
      </div>
      <div className="form-footer">
        {error && <span className="error-text">{error}</span>}
        {saved && <span className="form-status">{ar ? "تمت الإضافة" : "Package added"}</span>}
        <button type="submit" className="button button-primary" disabled={saving}>
          {saving ? (ar ? "جاري الإضافة..." : "Adding...") : (ar ? "إضافة الباقة" : "Add Package")}
        </button>
      </div>
    </form>
  );
}
