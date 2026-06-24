import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { List } from "@/lib/models/list";
import { fetchMediaByIds } from "@/lib/anilist";

export async function GET(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  await connectDB();

  const lists = await List.find({ userId }).lean();

  const response = await Promise.all(
    lists.map(async (list) => {
      const animeIds = list.animeIds ?? [];
      const mangaIds = list.mangaIds ?? [];

      const [animeMedia, mangaMedia] = await Promise.all([
        fetchMediaByIds(animeIds, "ANIME"),
        fetchMediaByIds(mangaIds, "MANGA"),
      ]);

      const mediaCount = animeMedia.length + mangaMedia.length;

      const animeById = new Map(animeMedia.map((item) => [item.id, item]));
      const mangaById = new Map(mangaMedia.map((item) => [item.id, item]));

      // Pick the last resolvable anime thumbnail first, then manga.
      let thumbnail: string | null = null;

      for (let i = animeIds.length - 1; i >= 0; i--) {
        const media = animeById.get(animeIds[i]);
        if (media?.coverImage?.extraLarge) {
          thumbnail = media.coverImage.extraLarge;
          break;
        }
      }

      if (!thumbnail) {
        for (let i = mangaIds.length - 1; i >= 0; i--) {
          const media = mangaById.get(mangaIds[i]);
          if (media?.coverImage?.extraLarge) {
            thumbnail = media.coverImage.extraLarge;
            break;
          }
        }
      }

      return {
        _id: list._id.toString(),
        name: list.name,
        isDefault: list.isDefault,
        mediaCount,
        thumbnail,
      };
    })
  );

  return Response.json(response);
}

export async function POST(req: Request) {
    const { name } = await req.json();
    const { userId } = await auth();

    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    if (!name || !name.trim()) {
        return new Response("List name is required", { status: 400 });
    }

    await connectDB();

    const newList = await List.create({
        userId,
        name: name.trim(),
        isDefault: false,
        animeIds: [],
        mangaIds: [],
    });

    return new Response(JSON.stringify(newList), {
        status: 201,
        headers: { "Content-Type": "application/json" },
    });
}
