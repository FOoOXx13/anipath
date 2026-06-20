import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { List } from "@/lib/models/list";
import { fetchMediaById } from "@/lib/anilist"; 

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

      const mediaCount = animeIds.length + mangaIds.length;

      // 👉 pick preview item (last added feels better UX)
      let previewId: number | null = null;
let previewType: "ANIME" | "MANGA" | null = null;

if (animeIds.length > 0) {
  previewId = animeIds[animeIds.length - 1];
  previewType = "ANIME";
} else if (mangaIds.length > 0) {
  previewId = mangaIds[mangaIds.length - 1];
  previewType = "MANGA";
}

      let thumbnail = null;

     if (previewId && previewType) {
  try {
    const media = await fetchMediaById(previewId, previewType);
    thumbnail = media?.coverImage?.extraLarge ?? null;
  } catch {
    thumbnail = null;
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
