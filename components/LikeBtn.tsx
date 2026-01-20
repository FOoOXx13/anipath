"use client";

import { useState, useTransition } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";

interface LikeBtnProps {
  animeId: number;
  initialLiked: boolean;
}

export default function LikeBtn({ animeId, initialLiked }: LikeBtnProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [isPending, startTransition] = useTransition();

  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();

  const toggleLike = () => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    // ✅ OPTIMISTIC UPDATE (instant UI)
    setLiked((prev) => !prev);

    startTransition(async () => {
      const res = await fetch("/api/anime/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animeId }),
      });

      if (!res.ok) {
        // ❌ rollback if server failed
        setLiked((prev) => !prev);
        return;
      }

      const data = await res.json();
      setLiked(data.liked); // final truth from server
    });
  };

  return (
    <button
      onClick={toggleLike}
      disabled={isPending}
      className="text-xl"
    >
      {liked ? "❤️" : "🤍"}
    </button>
  );
}
