import { searchAnime } from "@/lib/anilist";
import Card from "./Card";
import { getLikedAnimeIds } from "./useLikedAnimeIds";

export default async function SearchResults({search,}: {search?: string;}) {
  
  if (!search) {
    return <p className="text-muted">Start typing to search for anime</p>;
  }

  const [results, likedAnimeIds] = await Promise.all([
    searchAnime(search),
    getLikedAnimeIds(),
  ]);

  if (!results.length) {
    return <p>No results found</p>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 mt-12">
      {results.map((anime: any) => (
        <div
          key={anime.id}
          className="w-[120px] min-[1000px]:w-[200px] h-60 min-[1000px]:h-[380px]"
        >
          <Card
            imageSrc={anime.coverImage.large}
            animeTitle={anime.title.english ?? anime.title.romaji}
            animeId={anime.id}
            liked={likedAnimeIds.includes(anime.id)}
          />
        </div>
      ))}
    </div>
  );
}
