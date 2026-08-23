"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/types";

export function VerifyActions({ locale, opportunityId }: { locale: Locale; opportunityId: string }) {
  const ar = locale === "ar";
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  const act = async (approved: boolean) => {
    setLoading(approved ? "approve" : "reject");
    await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ opportunityId, approved })
    });
    setLoading(null);
    router.refresh();
  };

  return (
    <span className="admin-actions">
      <button className="btn-approve" onClick={() => act(true)} disabled={!!loading}>
        {loading === "approve" ? "..." : ar ? "قبول" : "Approve"}
      </button>
      <button className="btn-reject" onClick={() => act(false)} disabled={!!loading}>
        {loading === "reject" ? "..." : ar ? "رفض" : "Reject"}
      </button>
    </span>
  );
}
