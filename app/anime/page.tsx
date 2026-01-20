import CarouselSection from "@/components/carouselSection";
import {
  fetchTrendingAnime,
  fetchUpcomingAnime,
  fetchAllTimePopularAnime,
} from "@/lib/anilist";
import { getLikedAnimeIds } from "@/components/useLikedAnimeIds";

export default async function Home() {
  
  const [trending,upcoming,popular, likedAnimeIds,] = await Promise.all([
    fetchTrendingAnime(1),
    fetchUpcomingAnime(1),
    fetchAllTimePopularAnime(1),
    getLikedAnimeIds(),
  ]);

  return (
    <main className="flex flex-col justify-center items-center py-2 md:py-6 gap-2 min-[1001px]:gap-6">
      <CarouselSection
        animeList={trending}
        title="TRENDING"
        likedAnimeIds={likedAnimeIds}
      />

      <CarouselSection
        animeList={upcoming}
        title="UPCOMING"
        likedAnimeIds={likedAnimeIds}
      />

      <CarouselSection
        animeList={popular}
        title="ALL TIME POPULAR"
        likedAnimeIds={likedAnimeIds}
      />
    </main>
  );
}
