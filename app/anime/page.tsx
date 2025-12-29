import CarouselSection from "@/components/carouselSection";
import {
  fetchTrendingAnime,
  fetchUpcomingAnime,
  fetchAllTimePopularAnime,
} from "../lib/anilist";

export default async function Home() {


  const [trending, upcoming, popular] = await Promise.all([
    fetchTrendingAnime(1),
    fetchUpcomingAnime(1),
    fetchAllTimePopularAnime(1),
  ]);

  return (
    <main className="flex flex-col justify-center items-center py-6 min-[1001px]:py-10 gap-4 min-[1001px]:gap-10">

      <div className="max-w-full mx-auto">
        <h2 className="text-2xl min-[1001px]:text-4xl mb-4 lg:mb-8 px-2 md:px-12 font-bold">
          TRENDING NOW
        </h2>
        <CarouselSection animeList={trending} />
      </div>

      <div className="max-w-full mx-auto">
        <h2 className="text-2xl min-[1001px]:text-4xl mb-4 lg:mb-8 px-2 md:px-12 font-bold">
          UPCOMING NEXT SEASON
        </h2>

        <CarouselSection animeList={upcoming} />
      </div>

      <div className="max-w-full mx-auto">
        <h2 className="text-2xl min-[1001px]:text-4xl mb-4 lg:mb-8 px-2 md:px-12 font-bold">
          ALL TIME POPULAR
        </h2>

        <CarouselSection animeList={popular} />
      </div>

    </main>
  );
}
