import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { List } from "@/lib/models/list";
import { fetchMediaByIds } from "@/lib/anilist";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    return new Response("Unauthorizised", { status: 401 });
  }

  await connectDB();

  const list = await List.findOne({
    _id: id,
    userId,
  }).lean();

  if (!list) {
    return new Response("List not found", { status: 401 });
  }

  const animeIds = list.animeIds ?? [];
  const mangaIds = list.mangaIds ?? [];
  const [anime, manga] = await Promise.all([
    fetchMediaByIds(animeIds, "ANIME"),
    fetchMediaByIds(mangaIds, "MANGA"),
  ]);

  const media = [
    ...anime.map((item) => ({ ...item, mediaType: "ANIME" as const })),
    ...manga.map((item) => ({ ...item, mediaType: "MANGA" as const })),
  ];

  const animeOrder = new Map(animeIds.map((id, index) => [id, index]));
  const mangaOrder = new Map(mangaIds.map((id, index) => [id, index]));

  media.sort((a, b) => {
    const aOrder =
      a.mediaType === "ANIME"
        ? (animeOrder.get(a.id) ?? Number.MAX_SAFE_INTEGER)
        : (mangaOrder.get(a.id) ?? Number.MAX_SAFE_INTEGER);
    const bOrder =
      b.mediaType === "ANIME"
        ? (animeOrder.get(b.id) ?? Number.MAX_SAFE_INTEGER)
        : (mangaOrder.get(b.id) ?? Number.MAX_SAFE_INTEGER);

    return aOrder - bOrder;
  });

  return Response.json({
    _id: list._id.toString(),
    name: list.name,
    media,
    isDefault: list.isDefault,
  });
}
