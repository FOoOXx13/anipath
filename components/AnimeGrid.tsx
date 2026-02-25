"use client";

import Card from "@/components/Card";
import { Anime } from "@/lib/anilist";

interface AnimeGridProps {
  animeList: Anime[];
  likedAnimeIds: number[];
  savedAnimeIds: number[];
}

export default function AnimeGrid({
  animeList,
  likedAnimeIds,
  savedAnimeIds,
}: AnimeGridProps) {
  if (!animeList?.length) {
    return (
      <div className="text-center py-20 text-lg opacity-70">
        No anime found.
      </div>
    );
  }

  return (
    <div className="w-full px-4 mt-12">
      <div
        className="w-full flex flex-wrap justify-center gap-6 "
      >
        {animeList.map((anime) => {
          const displayTitle =
            anime.title.english || anime.title.romaji;
          return (
            <div className="w-[120px] min-[1000px]:w-[200px] h-60 min-[1000px]:h-[380px] mb-4" key={anime.id}>

                <Card
                  
                  animeId={anime.id}
                  imageSrc={anime.coverImage.large}
                  animeTitle={displayTitle}
                  liked={likedAnimeIds.includes(anime.id)}
                  saved={savedAnimeIds.includes(anime.id)}
                  genres={anime.genres}
                />
            </div>
          );
        })}
      </div>
    </div>
  );
}