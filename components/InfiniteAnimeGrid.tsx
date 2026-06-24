"use client";

import { useEffect, useRef, useState } from "react";
import Card from "@/components/Card";

export default function InfiniteAnimeGrid({ initialData, filters }: any) {
  const [page, setPage] = useState(1);
  const [anime, setAnime] = useState(initialData.media);
  const [hasNext, setHasNext] = useState(
    initialData.pageInfo.hasNextPage
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  setAnime(initialData.media);
  setPage(1);
  setHasNext(initialData.pageInfo.hasNextPage);
}, [initialData]);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadMore = async () => {
    if (loading || !hasNext) return;

    setLoading(true);

    const nextPage = page + 1;

    const params = new URLSearchParams();

    if (filters.genre) params.set("genre", filters.genre);
    if (filters.season) params.set("season", filters.season);
    if (filters.year) params.set("year", filters.year);
    if (filters.format) params.set("format", filters.format);
    if (filters.status) params.set("status", filters.status);

    params.set("page", String(nextPage));

    const res = await fetch(`/api/anime?${params.toString()}`);
    const data = await res.json();

    setAnime((prev: any[]) => {
      const map = new Map();

      [...prev, ...data.media].forEach((item) => {
        map.set(item.id, item);
      });

      return Array.from(map.values());
    });

    setPage(nextPage);
    setHasNext(data.pageInfo.hasNextPage);
    setLoading(false);
  };

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNext && !loading) {
        loadMore();
      }
    });

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [page, hasNext, loading]);

  return (
    <>
      {/* GRID */}
      <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
        {anime.map((anime: any) => (
          <div key={anime.id} className="w-[120px] md:w-[200px]">
            <Card
              mediaId={anime.id}
              mediaTitle={anime.title.english || anime.title.romaji}
              imageSrc={anime.coverImage.large}
              genres={anime.genres}
              color={anime.coverImage.color}
              type="ANIME"
              liked={false}
              saved={false}
            />
          </div>
        ))}
      </div>

      {/* LOADER TRIGGER */}
      <div ref={loaderRef} className="h-10" />

      {/* FALLBACK BUTTON */}
      {hasNext && (
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-(--color-accent) rounded"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {!hasNext && (
        <p className="text-center mt-4 text-gray-400">
          No more anime
        </p>
      )}
    </>
  );
}