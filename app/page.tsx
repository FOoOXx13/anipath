import CarouselSection from "@/components/carouselSection";
import {fetchTrendingMedia,fetchUpcomingAnime,fetchAllTimePopularMedia,} from "@/lib/anilist";
import { getLikedAnimeIds } from "@/components/getLikedAnimeIds";
import { getSavedAnimeIds } from "@/components/getSavedAmimeIds";

export default async function Home() {
  
  const [trendingAnime,upcoming,popularAnime, likedAnimeIds, savedAnimeIds, trendingManga, popularManga] = await Promise.all([
    fetchTrendingMedia(1, "ANIME"),
    fetchUpcomingAnime(1),
    fetchAllTimePopularMedia(1, "ANIME"),
    getLikedAnimeIds(),
    getSavedAnimeIds(),
    fetchTrendingMedia(1, "MANGA"),
    fetchAllTimePopularMedia(1, "MANGA"),


  ]);

  return (
    <main className="flex flex-col justify-center items-center py-2 md:py-6 gap-2 min-[1001px]:gap-6">
      <CarouselSection
        animeList={trendingAnime}
        title="TRENDING ANIME"
        likedAnimeIds={likedAnimeIds}
        savedAnimeIds={savedAnimeIds}

      />
      <CarouselSection
        animeList={upcoming}
        title="UPCOMING ANIME"
        likedAnimeIds={likedAnimeIds}
        savedAnimeIds={savedAnimeIds}
      />

      <CarouselSection
        animeList={popularAnime}
        title="ALL TIME POPULAR ANIME"
        likedAnimeIds={likedAnimeIds}
        savedAnimeIds={savedAnimeIds}

      />
          <CarouselSection
        animeList={trendingManga}
        title="TRENDING MANGA"
        likedAnimeIds={likedAnimeIds}
        savedAnimeIds={savedAnimeIds}

      />

            <CarouselSection
        animeList={popularManga}
        title="ALL TIME POPULAR MANGA"
        likedAnimeIds={likedAnimeIds}
        savedAnimeIds={savedAnimeIds}

      />
      
      
    </main>
  );
}
