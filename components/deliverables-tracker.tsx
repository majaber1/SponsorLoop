"use client";

import { useState } from "react";
import type { Locale } from "@/lib/types";
import { Check } from "./icons";

type Deliverable = {
  id: string;
  label: string;
  done: boolean;
  dueDate?: string;
};

const defaultDeliverables = (ar: boolean): Deliverable[] => [
  { id: "d1", label: ar ? "توقيع العقد" : "Contract signed", done: false },
  { id: "d2", label: ar ? "استلام أصول العلامة التجارية" : "Brand assets delivered", done: false },
  { id: "d3", label: ar ? "تفعيل العلامة في الموقع" : "On-site brand activation", done: false },
  { id: "d4", label: ar ? "محتوى رقمي منشور" : "Digital content published", done: false },
  { id: "d5", label: ar ? "تقرير الأداء النهائي" : "Final performance report", done: false },
];

export function DeliverablesTracker({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const [items, setItems] = useState<Deliverable[]>(defaultDeliverables(ar));
  const [newLabel, setNewLabel] = useState("");

  const toggle = (id: string) => {
    setItems((prev) => prev.map((d) => (d.id === id ? { ...d, done: !d.done } : d)));
  };

  const add = () => {
    if (!newLabel.trim()) return;
    setItems((prev) => [...prev, { id: `d-${Date.now()}`, label: newLabel, done: false }]);
    setNewLabel("");
  };

  const done = items.filter((d) => d.done).length;
  const pct = Math.round((done / items.length) * 100);

  return (
    <div className="deliverables-tracker">
      <div className="deliverables-header">
        <strong>{ar ? "متابعة التسليمات" : "Deliverables Tracker"}</strong>
        <span className="badge">{done}/{items.length} ({pct}%)</span>
      </div>
      <div className="deliverables-progress">
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
      </div>
      <div className="deliverables-list">
        {items.map((d) => (
          <label key={d.id} className={`deliverable-item ${d.done ? "done" : ""}`}>
            <button className={`deliverable-check ${d.done ? "checked" : ""}`} onClick={() => toggle(d.id)}>
              {d.done && <Check />}
            </button>
            <span>{d.label}</span>
          </label>
        ))}
      </div>
      <div className="deliverables-add">
        <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder={ar ? "إضافة تسليم جديد..." : "Add deliverable..."} onKeyDown={(e) => { if (e.key === "Enter") add(); }} />
        <button className="button button-ghost compact" onClick={add} disabled={!newLabel.trim()}>+</button>
      </div>
    </div>
  );
}
