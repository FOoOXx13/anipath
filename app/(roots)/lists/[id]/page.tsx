import { headers } from "next/headers";
import Card from "@/components/Card";
import DeleteListBtn from "@/components/DeleteListBtn";

async function getListMedia(listId: string) {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(`${protocol}://${host}/api/lists/${listId}/media`, {
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

 const listData = await getListMedia(id);
 const media = listData.media ?? [];


  return (
    <div className="px-4 md:px-8 xl:px-16 py-6 mt-6">
    <h1 className="text-2xl min-[1001px]:text-4xl font-bold mb-4 text-center md:text-left">
      {listData.name} ({media.length})
</h1>
      {
        !listData.isDefault && (
      <DeleteListBtn listId={listData._id}/>

        )
      }

      {media.length === 0 ? (
        <p>No media in this list yet 👀</p>
      ) : (
        <div className="flex flex-wrap gap-3 min-[1001px]:gap-4 justify-center md:justify-start">
          {media.map((item: any) => (
            <div
              key={`${item.mediaType}-${item.id}`}
              className="w-[120px] min-[1001px]:w-[200px]"
            >
              <Card
                mediaId={item.id}
                mediaTitle={item.title.english || item.title.romaji}
                imageSrc={item.coverImage.extraLarge}
                genres={item.genres}
                liked={false}
                saved={true}
                type={item.mediaType}
              />
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
