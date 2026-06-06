import CarouselSection from "@/components/carouselSection";
import {fetchTrendingMedia,fetchUpcomingAnime,fetchAllTimePopularMedia,} from "@/lib/anilist";
import { getLikedMediaIds } from "@/components/getLikedMediaIds";
import { getSavedMediaIds } from "@/components/getSavedMediaIds";

export default async function Home() {
  
  const [
    trendingAnime,
    upcoming,
    popularAnime,
    likedAnimeIds,
    savedAnimeIds,
    trendingManga,
    popularManga,
    likedMangaIds,
    savedMangaIds,
  ] = await Promise.all([
    fetchTrendingMedia(1, "ANIME"),
    fetchUpcomingAnime(1),
    fetchAllTimePopularMedia(1, "ANIME"),
    getLikedMediaIds("ANIME"),
    getSavedMediaIds("ANIME"),
    fetchTrendingMedia(1, "MANGA"),
    fetchAllTimePopularMedia(1, "MANGA"),
    getLikedMediaIds("MANGA"),
    getSavedMediaIds("MANGA"),


  ]);

  return (
    <main className="flex flex-col justify-center items-center py-2 md:py-6 gap-2 min-[1001px]:gap-6">
      <CarouselSection
        mediaList={trendingAnime}
        title="TRENDING ANIME"
        likedMediaIds={likedAnimeIds}
        savedMediaIds={savedAnimeIds}
        type="ANIME"

      />
      <CarouselSection
        mediaList={upcoming}
        title="UPCOMING ANIME"
        likedMediaIds={likedAnimeIds}
        savedMediaIds={savedAnimeIds}
        type="ANIME"

      />
      <CarouselSection
        mediaList={upcoming}
        title="UPCOMING ANIME"
        likedMediaIds={likedAnimeIds}
        savedMediaIds={savedAnimeIds}
        type="ANIME"
      />

      <CarouselSection
        mediaList={popularAnime}
        title="ALL TIME POPULAR ANIME"
        likedMediaIds={likedAnimeIds}
        savedMediaIds={savedAnimeIds}
        type="ANIME"

      />
          <CarouselSection
        mediaList={trendingManga}
        title="TRENDING MANGA"
        likedMediaIds={likedMangaIds}
        savedMediaIds={savedMangaIds}
        type="MANGA"

      />

            <CarouselSection
        mediaList={popularManga}
        title="ALL TIME POPULAR MANGA"
          likedMediaIds={likedMangaIds}
          savedMediaIds={savedMangaIds}
        type="MANGA"

      />
      
      
    </main>
  );
}
