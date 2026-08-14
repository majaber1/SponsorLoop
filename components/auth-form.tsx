"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/types";

export function AuthForm({ locale, mode }: { locale: Locale; mode: "sign-in"|"sign-up" }) {
  const ar=locale==="ar", router=useRouter(); const [error,setError]=useState("");
  const [form,setForm]=useState({email:mode==="sign-in"?"demo@sponsorloop.sa":"",password:mode==="sign-in"?"Demo123!":"",name:"",organizationName:"",role:"advertiser"});
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setError("");const r=await fetch(`/api/auth/${mode}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(form)});const j=await r.json(); if(r.ok){router.push(`/${locale}/dashboard`);router.refresh()}else setError(j.error||"Error")};
  return <form className="auth-card panel" onSubmit={submit}>
    <div className="auth-brand"><span className="brand-mark"><span>S</span></span><div><strong>SponsorLoop</strong><small>{ar?"مساحة عمل الرعايات والإعلانات":"Sponsorship & advertising workspace"}</small></div></div>
    <h1>{mode==="sign-in"?(ar?"مرحبًا بعودتك":"Welcome back"):(ar?"أنشئ مساحة عملك":"Create your workspace")}</h1>
    <p>{mode==="sign-in"?(ar?"ادخل لإدارة الحملات والفرص والصفقات من مكان واحد.":"Sign in to manage campaigns, opportunities and deals in one place."):(ar?"اختر نوع الحساب؛ يمكنك إضافة أعضاء وفِرق لاحقًا.":"Choose your account type; teams can be added later.")}</p>
    {mode==="sign-up"&&<><label className="field"><span>{ar?"الاسم":"Name"}</span><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label className="field"><span>{ar?"المنشأة / الجهة":"Organization"}</span><input required value={form.organizationName} onChange={e=>setForm({...form,organizationName:e.target.value})}/></label><label className="field"><span>{ar?"نوع الحساب":"Account type"}</span><select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option value="advertiser">{ar?"معلن / علامة تجارية":"Advertiser / Brand"}</option><option value="owner">{ar?"مالك فرصة / حقوق":"Rights holder"}</option><option value="agency">{ar?"وكالة":"Agency"}</option></select></label></>}
    <label className="field"><span>{ar?"البريد الإلكتروني":"Email"}</span><input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
    <label className="field"><span>{ar?"كلمة المرور":"Password"}</span><input type="password" minLength={8} required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>
    {error&&<div className="error-box">{error}</div>}
    <button className="button button-primary full">{mode==="sign-in"?(ar?"دخول":"Sign in"):(ar?"إنشاء الحساب":"Create account")}</button>
    {mode==="sign-in"&&<div className="demo-credentials"><strong>{ar?"تجربة فورية":"Instant demo"}</strong><code>demo@sponsorloop.sa</code><code>Demo123!</code></div>}
  </form>
}
