import { fetchAnime } from "@/lib/anilist";
import AnimeGrid from "@/components/AnimeGrid";
import { getLikedAnimeIds } from "@/components/getLikedAnimeIds";
import { getSavedAnimeIds } from "@/components/getSavedAmimeIds";
import Pagination from "@/components/Pagination";

export default async function AnimePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const page = Number(resolvedSearchParams.page) || 1;

  const [data, likedAnimeIds, savedAnimeIds] =
    await Promise.all([
       fetchAnime({ page, sort: "POPULARITY_DESC" }),
      getLikedAnimeIds(),
      getSavedAnimeIds(),
    ]);

  const { anime, pageInfo } = data;

  return (
    <main className="py-6 flex flex-col items-center gap-8">
      <AnimeGrid
        animeList={anime}
        likedAnimeIds={likedAnimeIds}
        savedAnimeIds={savedAnimeIds}
      />

      <Pagination
        currentPage={pageInfo.currentPage}
        lastPage={pageInfo.lastPage}
        hasNextPage={pageInfo.hasNextPage}
      />
    </main>
  );
}