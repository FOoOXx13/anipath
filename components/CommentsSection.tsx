"use client";

import { useEffect, useState } from "react";

export default function CommentSection({ animeId }: { animeId: number }) {
  const [text, setText] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch comments on mount
  useEffect(() => {
    fetch(`/api/comments/${animeId}`)
      .then((res) => res.json())
      .then(setComments);
  }, [animeId]);

  const handleSubmit = async () => {
    if (!text.trim()) return;

    setLoading(true);

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ animeId, text }),
    });

    if (res.ok) {
      const newComment = await res.json();

      // Add comment to top instantly
      setComments((prev) => [newComment, ...prev]);

      setText("");
    }

    setLoading(false);
  };

  return (
    <div className="mt-16 max-w-xl">
      {/* Input */}
      <div className="flex items-start gap-2">
        <textarea
  value={text}
  onChange={(e) => setText(e.target.value)}
  placeholder="Add a comment..."
  className="flex-1 px-3 py-2 rounded-lg border-none outline-none resize-none"
/>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-(--color-accent) px-4 py-2 rounded-lg"
        >
          {loading ? "Posting..." : "Comment"}
        </button>
      </div>

      {/* Comments */}
      <div className="mt-6 ">
        {comments.map((c) => (
          <div key={c._id} className="pb-6 flex gap-3">
  <img
    src={c.imageUrl || "/default-avatar.png"}
    alt="avatar"
    className="w-10 h-10 rounded-full shrink-0"
  />

  <div className="flex-1 min-w-0">
    <p className="font-semibold">{c.username}</p>
    <p className="wrap-break-word whitespace-pre-wrap overflow-wrap-anywhere">
      {c.text}
    </p>
  </div>
</div>
        ))}
      </div>
    </div>
  );
}