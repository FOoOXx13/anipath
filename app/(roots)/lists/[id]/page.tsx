import { headers } from "next/headers";
import Card from "@/components/Card";

async function getListAnime(listId: string) {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(`${protocol}://${host}/api/lists/${listId}/anime`, {
    cache: "no-store",
    headers: {
      cookie: headersList.get("cookie") ?? "",
    },
  });

  if (!res.ok) return [];

  return res.json();
}

export default async function ListAnimePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;   // ⭐ unwrap the promise

  const animeList = await getListAnime(id);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My List</h1>

      {animeList.length === 0 ? (
        <p>No anime in this list yet 👀</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {animeList.map((anime: any) => (
            <Card
              key={anime.id}
              animeId={anime.id}
              animeTitle={anime.title.english || anime.title.romaji}
              imageSrc={anime.coverImage.extraLarge}
              genres={anime.genres}
              liked={false}
              saved={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
