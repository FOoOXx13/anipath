import { headers } from "next/headers";
import Card from "@/components/Card";
import DeleteListBtn from "@/components/DeleteListBtn";

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
  const { id } = await params;   

 const listData = await getListAnime(id);


  return (
    <div className="p-6 mt-8 flex flex-col items-center md:items-start md:mx-10">
    <h1 className="text-2xl font-bold mb-6">
  {listData.name} ({listData.anime?.length ?? 0})
</h1>
      {
        !listData.isDefault && (
      <DeleteListBtn listId={listData._id}/>

        )
      }

      {listData.anime.length === 0 ? (
        <p>No anime in this list yet 👀</p>
      ) : (
        <div className="flex flex-wrap gap-6 w-fit justify-center md:justify-start">
          {listData.anime.map((anime: any) => (
            <div key={anime.id} className="w-[120px] min-[1000px]:w-[200px] h-60 min-[1000px]:h-[380px] mb-4" >
              <Card
                animeId={anime.id}
                animeTitle={anime.title.english || anime.title.romaji}
                imageSrc={anime.coverImage.extraLarge}
                genres={anime.genres}
                liked={false}
                saved={true}
              />
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
