import Card from "@/components/Card";
import { getMangaPage, Media } from "@/lib/anilist";
import Pagination from "@/components/Pagination";
import { getLikedMediaIds } from "@/components/getLikedMediaIds";
import { getSavedMediaIds } from "@/components/getSavedMediaIds";


export default async function MangaPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params?.page ?? "1");

  const [data, likedMangaIds, savedMangaIds] = await Promise.all([
    getMangaPage(page),
    getLikedMediaIds("MANGA"),
    getSavedMediaIds("MANGA"),
  ]);

  const computedLast =
    typeof data.pageInfo.total === "number" && typeof data.pageInfo.perPage === "number" && data.pageInfo.perPage > 0
      ? Math.ceil(data.pageInfo.total / data.pageInfo.perPage)
      : data.pageInfo.lastPage;

  const safeLast = Math.max(1, computedLast);
  const effectivePageInfo = {
    ...data.pageInfo,
    hasNextPage: page < safeLast,
    lastPage: safeLast,
  };

  return (
    <div className="px-4 py-6">

      <div >
      <h1 className=" text-2xl min-[1001px]:text-4xl mb-1 lg:mb-4 font-bold flex justify-center">MANGA</h1>

        <div className="flex flex-wrap gap-3 min-[1001px]:gap-4 justify-center">
        {data.media.map((manga: Media) => (
          <div key={manga.id} className="w-[120px] min-[1001px]:w-[200px]">
            <Card
              mediaId={manga.id}
              mediaTitle={manga.title.english || manga.title.romaji}
              imageSrc={manga.coverImage.large}
              liked={likedMangaIds.includes(manga.id)}
              saved={savedMangaIds.includes(manga.id)}
              genres={manga.genres}
              color={manga.coverImage.color}
              type="MANGA"
            />
          </div>
        ))}
        </div>
      </div>
      <div className='flex w-full justify-center mt-6'>
      <Pagination page={page} basePath="/manga" mediaType="MANGA" pageInfo={effectivePageInfo} />
      </div>
    </div>
  );
}