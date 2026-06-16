import Card from "@/components/Card";
import { getAnimePage, Media } from "@/lib/anilist";
import Pagination from "@/components/Pagination";
import { getLikedMediaIds } from "@/components/getLikedMediaIds";
import { getSavedMediaIds } from "@/components/getSavedMediaIds";
import FilterBar from "@/components/FilterBar";

export default async function AnimePage({
  searchParams,
}: {
 searchParams?: Promise<{
  page?: string;
  genre?: string;
  season?: string;
  year?: string;
  format?: string;
  status?: string;
}>;
}) {
  const params = await searchParams;
  const page = Number(params?.page ?? "1");
  const genre = params?.genre;
const season = params?.season;
const year = params?.year;
const format = params?.format;
const status = params?.status;

  const [data, likedAnimeIds, savedAnimeIds] = await Promise.all([
    getAnimePage(page, { genre, season, year, format, status }),
    getLikedMediaIds("ANIME"),
    getSavedMediaIds("ANIME"),
  ]);

  let effectivePageInfo = data.pageInfo;

  // Fix AniList phantom last page issue
  if (data.pageInfo.hasNextPage) {
    const nextPageData = await getAnimePage(page + 1, {
  genre,
  season,
  year,
  format,
  status,
});
    const nextPageHasContent =
      Array.isArray(nextPageData?.media) && nextPageData.media.length > 0;

    if (!nextPageHasContent) {
      effectivePageInfo = {
        ...effectivePageInfo,
        hasNextPage: false,
        lastPage: Math.min(effectivePageInfo.lastPage, page),
      };
    } else if (!nextPageData?.pageInfo?.hasNextPage) {
      effectivePageInfo = {
        ...effectivePageInfo,
        lastPage: Math.min(effectivePageInfo.lastPage, page + 1),
      };
    }
  }

  return (
    <div className="px-4 md:px-8 xl:px-16 py-6">
      
      {/* HEADER */}
      <div className="flex flex-col items-center gap-4 mb-4">
        
        <h1 className="text-2xl min-[1001px]:text-4xl font-bold">
          ANIME
        </h1>

        {/* Sort buttons */}
        <div className="flex gap-2">
          <div className="relative z-20">
         <FilterBar/>
          </div>
      
        </div>

      </div>

      {/* CARDS */}
      <div className="flex flex-wrap gap-3 min-[1001px]:gap-4 justify-center">
        {data.media.map((anime: Media) => (
          <div key={anime.id} className="w-[120px] min-[1001px]:w-[200px]">
            <Card
              mediaId={anime.id}
              mediaTitle={anime.title.english || anime.title.romaji}
              imageSrc={anime.coverImage.large}
              liked={likedAnimeIds.includes(anime.id)}
              saved={savedAnimeIds.includes(anime.id)}
              genres={anime.genres}
              color={anime.coverImage.color}
              type="ANIME"
            />
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-6">
        <Pagination page={page} basePath="/anime" pageInfo={effectivePageInfo} />
      </div>

    </div>
  );
}