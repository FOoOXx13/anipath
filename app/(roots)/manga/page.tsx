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

  let effectivePageInfo = data.pageInfo;

  // Guard against phantom trailing pages returned by the upstream API.
  if (data.pageInfo.hasNextPage) {
    const nextPageData = await getMangaPage(page + 1);
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
      <Pagination page={page} basePath="/manga" pageInfo={effectivePageInfo} />
      </div>
    </div>
  );
}