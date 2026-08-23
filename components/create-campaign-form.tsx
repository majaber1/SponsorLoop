"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/types";

export function CreateCampaignForm({ locale }: { locale: Locale }) {
  const ar=locale==="ar", router=useRouter();
  const [status,setStatus]=useState("");
  const [form,setForm]=useState({title:"",objective:"awareness",budget:50000,city:"Riyadh",audience:""});
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setStatus(ar?"جاري الحفظ...":"Saving...");const r=await fetch("/api/campaigns",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({...form,audience:form.audience.split(",").map(x=>x.trim()).filter(Boolean)})}); if(r.ok){setStatus(ar?"تم إنشاء الحملة":"Campaign created");router.push(`/${locale}/planner?budget=${form.budget}&objective=${form.objective}`)}else setStatus(ar?"تعذر الحفظ":"Could not save")};
  return <form className="form-card panel" onSubmit={submit}>
    <div className="form-grid">
      <label className="field span-2"><span>{ar?"اسم الحملة":"Campaign name"}</span><input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder={ar?"مثال: إطلاق منتج الأمن السيبراني":"e.g. Cybersecurity product launch"}/></label>
      <label className="field"><span>{ar?"الهدف":"Objective"}</span><select value={form.objective} onChange={e=>setForm({...form,objective:e.target.value})}><option value="awareness">{ar?"وعي بالعلامة":"Brand awareness"}</option><option value="leads">{ar?"عملاء محتملون":"Lead generation"}</option><option value="thought_leadership">{ar?"قيادة فكرية":"Thought leadership"}</option><option value="launch">{ar?"إطلاق منتج":"Product launch"}</option></select></label>
      <label className="field"><span>{ar?"الميزانية":"Budget"}</span><div className="money-input"><input type="number" min="1000" value={form.budget} onChange={e=>setForm({...form,budget:Number(e.target.value)})}/><b>SAR</b></div></label>
      <label className="field"><span>{ar?"المدينة":"City"}</span><select value={form.city} onChange={e=>setForm({...form,city:e.target.value})}><option>Riyadh</option><option>Jeddah</option><option>Dammam</option><option>Khobar</option><option>Makkah</option><option>Madinah</option><option>Tabuk</option></select></label>
      <label className="field"><span>{ar?"الجمهور المستهدف":"Target audience"}</span><input value={form.audience} onChange={e=>setForm({...form,audience:e.target.value})} placeholder="CIO, CISO, Founders"/></label>
    </div>
    <div className="form-footer"><span className="form-status">{status}</span><button className="button button-primary" type="submit">{ar?"إنشاء وتحليل الفرص":"Create & find matches"}</button></div>
  </form>
}
