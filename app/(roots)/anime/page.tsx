import CarouselSection from "@/components/carouselSection";
import {fetchTrendingMedia,fetchUpcomingAnime,fetchAllTimePopularMedia,} from "@/lib/anilist";
import { getLikedAnimeIds } from "@/components/getLikedAnimeIds";
import { getSavedAnimeIds } from "@/components/getSavedAmimeIds";

export default async function Home() {
  
  const [trending,upcoming,popular, likedAnimeIds, savedAnimeIds] = await Promise.all([
    fetchTrendingMedia(1, "ANIME"),
    fetchUpcomingAnime(1),
    fetchAllTimePopularMedia(1, "ANIME"),
    getLikedAnimeIds(),
    getSavedAnimeIds(),
  ]);

  return (
    <main className="flex flex-col justify-center items-center py-2 md:py-6 gap-2 min-[1001px]:gap-6">
      <CarouselSection
        animeList={trending}
        title="TRENDING"
        likedAnimeIds={likedAnimeIds}
        savedAnimeIds={savedAnimeIds}

      />
      <CarouselSection
        animeList={upcoming}
        title="UPCOMING"
        likedAnimeIds={likedAnimeIds}
        savedAnimeIds={savedAnimeIds}
      />

      <CarouselSection
        animeList={popular}
        title="ALL TIME POPULAR"
        likedAnimeIds={likedAnimeIds}
        savedAnimeIds={savedAnimeIds}

      />
    </main>
  );
}
