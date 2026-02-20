import { searchAnime } from "@/lib/anilist";
import Card from "./Card";
import { getLikedAnimeIds } from "./getLikedAnimeIds";
import { getSavedAnimeIds } from "./getSavedAmimeIds";

export default async function SearchResults({search,}: {search?: string;}) {
  
  if (!search) {
    return <p className="text-muted">Start typing to search for anime</p>;
  }

  const [results, likedAnimeIds, savedAnimeIds] = await Promise.all([
    searchAnime(search),
    getLikedAnimeIds(),
    getSavedAnimeIds(),
  ]);

  if (!results.length) {
    return <p>No results found</p>;
  }


  return (
    <div className="flex flex-wrap justify-center gap-6 mt-12">
     {results.map((anime: any) => {
  const titleText = anime.title.english ?? anime.title.romaji ?? "";
  const displayTitle =
    titleText.length > 30 ? titleText.slice(0, 30) + "…" : titleText;

  return (
    <div
      key={anime.id}
      className="w-[120px] min-[1000px]:w-[200px] h-60 min-[1000px]:h-[380px] mb-4"
    >
      <Card
        imageSrc={anime.coverImage.large}
        animeTitle={displayTitle}
        animeId={anime.id}
         genres={anime.genres}
        liked={likedAnimeIds.includes(anime.id)}
        saved={savedAnimeIds.includes(anime.id)}
      />
    </div>
  );
})}
    </div>
  );
}
