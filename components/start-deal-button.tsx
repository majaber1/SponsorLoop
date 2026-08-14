"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/types";
import { Handshake } from "./icons";

export function StartDealButton({ locale, opportunityId, amount }: { locale: Locale; opportunityId: string; amount: number }) {
  const ar=locale==="ar",router=useRouter(); const[busy,setBusy]=useState(false); const[error,setError]=useState("");
  const start=async()=>{setBusy(true);setError("");const r=await fetch("/api/deals",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({opportunityId,amount})});const j=await r.json();if(r.ok)router.push(`/${locale}/deals/${j.data.id}`);else setError(j.error||"Error");setBusy(false)};
  return <div className="deal-cta"><button className="button button-primary full" onClick={start} disabled={busy}><Handshake size={18}/>{busy?(ar?"جاري إنشاء الصفقة...":"Creating deal..."):(ar?"ابدأ صفقة على هذه الفرصة":"Start a deal")}</button>{error&&<small className="error-text">{error}</small>}</div>
}
