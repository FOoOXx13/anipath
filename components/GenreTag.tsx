"use client";

import { useRouter } from "next/navigation";

export default function GenreTag({ genre,color }: { genre: string; color?: string | null  }) {
  const router = useRouter();

  return (
    <span
    
      className=" rounded-2xl p-2 cursor-pointer"
       style={{
    backgroundColor: color ?? "var(--color-accent)", 
    color: "#fff"
  }}
    >
      {genre}
    </span>
  );
}
