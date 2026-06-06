"use client";

import { useState, useTransition } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";
import Image from "next/image";
import { MediaType } from "@/lib/anilist";
import { useRouter } from "next/navigation";

interface LikeBtnProps {
  mediaId: number;
  mediaType: MediaType;
  initialLiked: boolean;
}

export default function LikeBtn({ mediaId, mediaType, initialLiked }: LikeBtnProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();

  const toggleLike = () => {
    if (!isSignedIn) {
      openSignIn(); 
      return;
    }

    // OPTIMISTIC UPDATE (instant UI)
    setLiked((prev) => !prev);

    startTransition(async () => {
      const res = await fetch("/api/media/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId, mediaType }),
      });

      if (!res.ok) {
        // rollback if server failed
        setLiked((prev) => !prev);
        return;
      }

      const data = await res.json();
      setLiked(data.liked); 
      router.refresh();
    });
  };

  return (
    <button
      onClick={toggleLike}
      disabled={isPending}
      className="text-xl"
    >
      {liked ? 
        <Image src="/icons/like_dark_fill.png" alt="like_btn" width={24} height={24}/>
      :
        <Image src="/icons/like_dark.png" alt="like_btn" width={24} height={24}/>
      }
    </button>
  );
}
