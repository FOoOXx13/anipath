
import { fetchAnimeById } from "@/app/lib/anilist"


export default async function AnimePage({ params }: { params: any }) {
  const resolvedParams = await Promise.resolve(params);
  const anime = await fetchAnimeById(Number(resolvedParams.id));

  if (!anime) return <div>Anime not found</div>;

  return (
    <main>
      <h1>{anime.title.english ?? anime.title.romaji}</h1>

      <img src={anime.coverImage.large} alt={anime.title.romaji} />

      <div
        dangerouslySetInnerHTML={{ __html: anime.description }}
        />

      <p>Episodes: {anime.episodes ?? "TBA"}</p>

      <p>
        {anime.season} {anime.seasonYear}
      </p>
    </main>
  );
}
