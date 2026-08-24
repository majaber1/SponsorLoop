"use client";

import { useState } from "react";
import type { Locale } from "@/lib/types";

type ProposalVersion = {
  id: number;
  amount: number;
  terms: string;
  createdAt: string;
  author: string;
};

export function ProposalBuilder({ locale, dealAmount }: { locale: Locale; dealAmount: number }) {
  const ar = locale === "ar";
  const [versions, setVersions] = useState<ProposalVersion[]>([
    { id: 1, amount: dealAmount, terms: ar ? "الشروط الأولية كما هو متفق عليه" : "Initial terms as agreed", createdAt: new Date().toISOString(), author: "System" }
  ]);
  const [amount, setAmount] = useState(dealAmount);
  const [terms, setTerms] = useState("");
  const [expanded, setExpanded] = useState(false);

  const submit = () => {
    if (!terms.trim()) return;
    setVersions((prev) => [
      { id: prev.length + 1, amount, terms, createdAt: new Date().toISOString(), author: "You" },
      ...prev
    ]);
    setTerms("");
    setExpanded(false);
  };

  return (
    <div className="proposal-builder">
      <div className="proposal-header">
        <strong>{ar ? "مقترح العرض" : "Proposal Builder"}</strong>
        <button className="button button-ghost compact" onClick={() => setExpanded(!expanded)}>
          {expanded ? (ar ? "إلغاء" : "Cancel") : (ar ? "إصدار جديد" : "New Version")}
        </button>
      </div>
      {expanded && (
        <div className="proposal-form">
          <label className="field">
            <span>{ar ? "المبلغ المقترح" : "Proposed Amount"}</span>
            <div className="money-input">
              <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} min={0} />
              <b>SAR</b>
            </div>
          </label>
          <label className="field">
            <span>{ar ? "الشروط والملاحظات" : "Terms & Notes"}</span>
            <textarea value={terms} onChange={(e) => setTerms(e.target.value)} rows={3} placeholder={ar ? "اكتب شروط العرض..." : "Describe your proposal terms..."} />
          </label>
          <button className="button button-primary compact" onClick={submit} disabled={!terms.trim()}>
            {ar ? "إرسال العرض" : "Submit Proposal"}
          </button>
        </div>
      )}
      <div className="proposal-versions">
        {versions.map((v) => (
          <div key={v.id} className="proposal-version">
            <div className="proposal-version-head">
              <span className="badge">v{v.id}</span>
              <strong>{v.amount.toLocaleString()} SAR</strong>
              <small>{new Date(v.createdAt).toLocaleDateString(ar ? "ar-SA" : "en-US", { month: "short", day: "numeric" })}</small>
              <small>{v.author}</small>
            </div>
            <p>{v.terms}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
