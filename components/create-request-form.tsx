"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale, OpportunityCategory } from "@/lib/types";

export function CreateRequestForm({ locale }: { locale: Locale }) {
  const ar = locale === "ar", router = useRouter();
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({
    organizationNameAr: "", organizationNameEn: "", titleAr: "", titleEn: "",
    descriptionAr: "", descriptionEn: "", category: "events" as OpportunityCategory,
    city: "Riyadh", budgetRange: "10K–50K SAR", audienceSize: 10000
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(ar ? "جاري الإرسال..." : "Submitting...");
    const r = await fetch("/api/requests", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form)
    });
    if (r.ok) {
      setStatus(ar ? "تم إنشاء الطلب بنجاح" : "Request created successfully");
      router.push(`/${locale}/requests`);
    } else {
      const j = await r.json();
      setStatus(j.error || "Error");
    }
  };

  return (
    <form className="form-card panel" onSubmit={submit}>
      <div className="form-grid">
        <label className="field"><span>{ar ? "اسم الجهة بالعربية" : "Organization name (Arabic)"}</span><input dir="rtl" required value={form.organizationNameAr} onChange={e => setForm({ ...form, organizationNameAr: e.target.value })} /></label>
        <label className="field"><span>{ar ? "اسم الجهة بالإنجليزية" : "Organization name (English)"}</span><input dir="ltr" required value={form.organizationNameEn} onChange={e => setForm({ ...form, organizationNameEn: e.target.value })} /></label>
        <label className="field"><span>{ar ? "عنوان الطلب بالعربية" : "Request title (Arabic)"}</span><input dir="rtl" required value={form.titleAr} onChange={e => setForm({ ...form, titleAr: e.target.value })} /></label>
        <label className="field"><span>{ar ? "عنوان الطلب بالإنجليزية" : "Request title (English)"}</span><input dir="ltr" required value={form.titleEn} onChange={e => setForm({ ...form, titleEn: e.target.value })} /></label>
        <label className="field span-2"><span>{ar ? "وصف بالعربية" : "Description (Arabic)"}</span><textarea dir="rtl" value={form.descriptionAr} onChange={e => setForm({ ...form, descriptionAr: e.target.value })} /></label>
        <label className="field span-2"><span>{ar ? "وصف بالإنجليزية" : "Description (English)"}</span><textarea dir="ltr" value={form.descriptionEn} onChange={e => setForm({ ...form, descriptionEn: e.target.value })} /></label>
        <label className="field"><span>{ar ? "الفئة" : "Category"}</span>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as OpportunityCategory })}>
            <option value="events">Events</option><option value="creators">Creators</option>
            <option value="podcasts">Podcasts</option><option value="sports">Sports</option>
            <option value="athletes">Athletes</option><option value="hackathons">Hackathons</option>
            <option value="clubs">Clubs</option><option value="digital">Digital</option>
            <option value="ooh">OOH</option><option value="community">Community</option>
            <option value="gaming">Gaming</option>
          </select>
        </label>
        <label className="field"><span>{ar ? "المدينة" : "City"}</span>
          <select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}>
            <option>Riyadh</option><option>Jeddah</option><option>Dammam</option>
            <option>Makkah</option><option>Madinah</option><option>Khobar</option><option>Tabuk</option>
          </select>
        </label>
        <label className="field"><span>{ar ? "الميزانية المتوقعة" : "Expected budget range"}</span>
          <select value={form.budgetRange} onChange={e => setForm({ ...form, budgetRange: e.target.value })}>
            <option value="5K–15K SAR">5K–15K SAR</option>
            <option value="10K–50K SAR">10K–50K SAR</option>
            <option value="50K–100K SAR">50K–100K SAR</option>
            <option value="100K–300K SAR">100K–300K SAR</option>
            <option value="300K+ SAR">300K+ SAR</option>
          </select>
        </label>
        <label className="field"><span>{ar ? "حجم الجمهور" : "Audience size"}</span><input type="number" min="100" value={form.audienceSize} onChange={e => setForm({ ...form, audienceSize: Number(e.target.value) })} /></label>
      </div>
      <div className="form-footer">
        <span className="form-status">{status}</span>
        <button className="button button-primary">{ar ? "نشر طلب الرعاية" : "Publish sponsorship request"}</button>
      </div>
    </form>
  );
}
