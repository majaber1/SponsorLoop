"use client";

import { useState } from "react";
import { Heart, HeartFilled } from "./icons";

export function FavoriteButton({ opportunityId, initialFav }: { opportunityId: string; initialFav: boolean }) {
  const [fav, setFav] = useState(initialFav);
  const [loading, setLoading] = useState(false);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const r = await fetch("/api/favorites", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ opportunityId })
    });
    if (r.ok) setFav(!fav);
    setLoading(false);
  };

  return (
    <button className={`fav-btn ${fav ? "fav-active" : ""}`} onClick={toggle} disabled={loading} aria-label={fav ? "Remove from favorites" : "Add to favorites"}>
      {fav ? <HeartFilled size={16} /> : <Heart size={16} />}
    </button>
  );
}
