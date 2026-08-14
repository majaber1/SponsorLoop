"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale, OpportunityCategory } from "@/lib/types";

export function CreateOpportunityForm({ locale }: { locale: Locale }) {
  const ar=locale==="ar", router=useRouter(); const [status,setStatus]=useState("");
  const [form,setForm]=useState({titleAr:"",titleEn:"",descriptionAr:"",descriptionEn:"",category:"events" as OpportunityCategory,city:"Riyadh",startingPrice:25000,estimatedReach:20000,audience:"",formats:""});
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setStatus(ar?"جاري النشر...":"Publishing...");const r=await fetch("/api/opportunities",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({...form,audience:form.audience.split(",").map(x=>x.trim()).filter(Boolean),formats:form.formats.split(",").map(x=>x.trim()).filter(Boolean)})});const j=await r.json();if(r.ok){setStatus(ar?"تمت إضافة الفرصة":"Opportunity added");router.push(`/${locale}/opportunities/${j.data.id}`)}else setStatus(j.error||"Error")};
  return <form className="form-card panel" onSubmit={submit}><div className="form-grid">
    <label className="field"><span>{ar?"العنوان بالعربية":"Arabic title"}</span><input dir="rtl" required value={form.titleAr} onChange={e=>setForm({...form,titleAr:e.target.value})}/></label>
    <label className="field"><span>{ar?"العنوان بالإنجليزية":"English title"}</span><input dir="ltr" required value={form.titleEn} onChange={e=>setForm({...form,titleEn:e.target.value})}/></label>
    <label className="field span-2"><span>{ar?"الوصف بالعربية":"Arabic description"}</span><textarea dir="rtl" value={form.descriptionAr} onChange={e=>setForm({...form,descriptionAr:e.target.value})}/></label>
    <label className="field span-2"><span>{ar?"الوصف بالإنجليزية":"English description"}</span><textarea dir="ltr" value={form.descriptionEn} onChange={e=>setForm({...form,descriptionEn:e.target.value})}/></label>
    <label className="field"><span>{ar?"الفئة":"Category"}</span><select value={form.category} onChange={e=>setForm({...form,category:e.target.value as OpportunityCategory})}><option value="events">Events</option><option value="creators">Creators</option><option value="podcasts">Podcasts</option><option value="sports">Sports</option><option value="digital">Digital</option><option value="ooh">OOH</option><option value="community">Community</option><option value="gaming">Gaming</option></select></label>
    <label className="field"><span>{ar?"المدينة":"City"}</span><select value={form.city} onChange={e=>setForm({...form,city:e.target.value})}><option>Riyadh</option><option>Jeddah</option></select></label>
    <label className="field"><span>{ar?"السعر الابتدائي":"Starting price"}</span><div className="money-input"><input type="number" min="1" value={form.startingPrice} onChange={e=>setForm({...form,startingPrice:Number(e.target.value)})}/><b>SAR</b></div></label>
    <label className="field"><span>{ar?"الوصول التقديري":"Estimated reach"}</span><input type="number" min="0" value={form.estimatedReach} onChange={e=>setForm({...form,estimatedReach:Number(e.target.value)})}/></label>
    <label className="field"><span>{ar?"شرائح الجمهور":"Audience segments"}</span><input value={form.audience} onChange={e=>setForm({...form,audience:e.target.value})} placeholder="CIO, Students, Families"/></label>
    <label className="field"><span>{ar?"الصيغ المتاحة":"Formats"}</span><input value={form.formats} onChange={e=>setForm({...form,formats:e.target.value})} placeholder="Booth, Video, Newsletter"/></label>
  </div><div className="form-footer"><span className="form-status">{status}</span><button className="button button-primary">{ar?"نشر الفرصة":"Publish opportunity"}</button></div></form>
}
