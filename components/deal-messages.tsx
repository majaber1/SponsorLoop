"use client";

import { useEffect, useState } from "react";
import type { DealMessage, Locale } from "@/lib/types";
import { MessageCircle, Send } from "./icons";

export function DealMessages({ locale, dealId }: { locale: Locale; dealId: string }) {
  const ar = locale === "ar";
  const [messages, setMessages] = useState<DealMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    fetch(`/api/deals/${dealId}/messages`)
      .then((r) => r.json())
      .then((j) => setMessages(j.data ?? []));
    fetch("/api/me")
      .then((r) => r.json())
      .then((j) => {
        if (j.user) setUser({ name: j.user.name, role: j.user.role });
      });
  }, [dealId]);

  const senderRole = user?.role === "owner" ? "seller" : "buyer";

  const send = async () => {
    if (!text.trim()) return;
    setSending(true);
    const r = await fetch(`/api/deals/${dealId}/messages`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: text, senderName: user?.name ?? "User", senderRole })
    });
    if (r.ok) {
      const j = await r.json();
      setMessages((prev) => [j.data, ...prev]);
      setText("");
    }
    setSending(false);
  };

  return (
    <div className="deal-messages-section">
      <div className="panel-head">
        <div>
          <strong><MessageCircle size={16} /> {ar ? "سجل المحادثات" : "Deal Activity"}</strong>
          <small>{ar ? "التواصل داخل الصفقة" : "In-deal communication"}</small>
        </div>
      </div>
      <div className="msg-compose">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={ar ? "اكتب رسالة..." : "Type a message..."}
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
        />
        <button className="button button-primary compact" onClick={send} disabled={sending || !text.trim()}>
          <Send size={16} />
        </button>
      </div>
      <div className="msg-list">
        {messages.map((m) => (
          <div key={m.id} className={`msg-item msg-${m.senderRole}`}>
            <div className="msg-meta">
              <strong>{m.senderName}</strong>
              <small>{new Date(m.createdAt).toLocaleDateString(ar ? "ar-SA" : "en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</small>
            </div>
            <p>{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
