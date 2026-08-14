"use client";

import { useEffect, useState } from "react";
import type { Locale, Notification } from "@/lib/types";
import { Bell } from "./icons";

export function NotificationBell({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((j) => setItems(j.data ?? []));
  }, []);

  const unread = items.filter((x) => !x.read).length;

  const markRead = async (id: string) => {
    await fetch("/api/notifications", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id }) });
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, read: true } : x)));
  };

  return (
    <div className="notif-wrap">
      <button className="icon-button notif-trigger" onClick={() => setOpen(!open)} aria-label="Notifications">
        <Bell size={18} />
        {unread > 0 && <span className="notif-badge">{unread}</span>}
      </button>
      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <strong>{ar ? "الإشعارات" : "Notifications"}</strong>
            <small>{unread} {ar ? "غير مقروءة" : "unread"}</small>
          </div>
          <div className="notif-list">
            {items.map((n) => (
              <button
                key={n.id}
                className={`notif-item ${n.read ? "" : "unread"}`}
                onClick={() => { markRead(n.id); if (n.link) window.location.href = `/${locale}${n.link}`; }}
              >
                <span className={`notif-dot ${n.type}`} />
                <div>
                  <strong>{ar ? n.titleAr : n.titleEn}</strong>
                  <p>{ar ? n.bodyAr : n.bodyEn}</p>
                  <small>{new Date(n.createdAt).toLocaleDateString(ar ? "ar-SA" : "en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</small>
                </div>
              </button>
            ))}
            {!items.length && <p className="notif-empty">{ar ? "لا توجد إشعارات" : "No notifications"}</p>}
          </div>
        </div>
      )}
      {open && <div className="notif-overlay" onClick={() => setOpen(false)} />}
    </div>
  );
}
