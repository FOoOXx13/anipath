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
    <div className="mt-10 max-w-xl">
      {/* Input */}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 border px-3 py-2 rounded-lg"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 rounded-lg"
        >
          {loading ? "Posting..." : "Comment"}
        </button>
      </div>

      {/* Comments */}
      <div className="mt-6 space-y-4">
        {comments.map((c) => (
          <div key={c._id} className="border-b pb-3">
           <div className="flex items-center gap-2">
  <img
  src={c.imageUrl || "/default-avatar.png"}
  alt="avatar"
  className="w-8 h-8 rounded-full"
/>
  <p className="font-semibold">{c.username}</p>
</div>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}