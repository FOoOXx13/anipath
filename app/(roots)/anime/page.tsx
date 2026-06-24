import FilterBar from "@/components/FilterBar";
import InfiniteAnimeGrid from "@/components/InfiniteAnimeGrid";
import { getAnimePage } from "@/lib/anilist";

export default async function AnimePage({
  searchParams,
}: {
  searchParams: any;
}) {
  // 🔥 Normalize searchParams (Next 16 fix)
  const params =
    searchParams && typeof searchParams.then === "function"
      ? await searchParams
      : searchParams || {};

  const page = Number(params.page || "1");

  const genre = params.genre;
  const season = params.season;
  const year = params.year;
  const format = params.format;
  const status = params.status;

  const initialData = await getAnimePage(page, {
    genre,
    season,
    year,
    format,
    status,
  });

  return (
    <div className="px-4 md:px-8 xl:px-16 py-6">
      <h1 className="text-2xl md:text-4xl font-bold text-center mb-6">
        ANIME
      </h1>

      <div className="mb-6 flex justify-center">
        <FilterBar />
      </div>

      <InfiniteAnimeGrid
        initialData={initialData}
        filters={{ genre, season, year, format, status }}
      />
    </div>
  );
}