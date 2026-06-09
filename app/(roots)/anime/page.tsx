import Card from "@/components/Card";
import { getAnimePage, Media } from "@/lib/anilist";
import Pagination from "@/components/Pagination";
import { getLikedMediaIds } from "@/components/getLikedMediaIds";
import { getSavedMediaIds } from "@/components/getSavedMediaIds";


export default async function AnimePage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params?.page ?? "1");

  const [data, likedAnimeIds, savedAnimeIds] = await Promise.all([
    getAnimePage(page),
    getLikedMediaIds("ANIME"),
    getSavedMediaIds("ANIME"),
  ]);

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Anime</h1>

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
      <div className='flex w-full justify-center mt-6'>
      <Pagination page={page} pageInfo={data.pageInfo} />
      </div>
    </div>
  );
}