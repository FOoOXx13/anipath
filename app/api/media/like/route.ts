import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { Media } from "@/lib/models/media";
import { List } from "@/lib/models/list";

export async function POST(req: Request) {
  const { animeId, mediaId, mediaType } = await req.json();
  const resolvedMediaId =
    typeof mediaId === "number"
      ? mediaId
      : typeof animeId === "number"
        ? animeId
        : null;
  const resolvedMediaType = mediaType === "MANGA" ? "MANGA" : "ANIME";
  const listField = resolvedMediaType === "MANGA" ? "mangaIds" : "animeIds";
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (typeof resolvedMediaId !== "number") {
    return new Response("Invalid payload", { status: 400 });
  }

  await connectDB();

  await Media.findOneAndUpdate(
    { mediaId: resolvedMediaId, mediaType: resolvedMediaType },
    {
      $setOnInsert: {
        mediaId: resolvedMediaId,
        mediaType: resolvedMediaType,
        likesCount: 0,
      },
    },
    { upsert: true }
  );

  let likedList = await List.findOne({
    userId,
    isDefault: true,
    name: "Liked",
  });

  if (!likedList) {
    likedList = await List.create({
      userId,
      name: "Liked",
      isDefault: true,
      animeIds: [],
      mangaIds: [],
    });
  } else {
    const needsAnimeIds = !Array.isArray(likedList.animeIds);
    const needsMangaIds = !Array.isArray(likedList.mangaIds);

    if (needsAnimeIds || needsMangaIds) {
      await List.updateOne(
        { _id: likedList._id },
        {
          $set: {
            ...(needsAnimeIds ? { animeIds: [] } : {}),
            ...(needsMangaIds ? { mangaIds: [] } : {}),
          },
        }
      );
      likedList = await List.findById(likedList._id);
    }
  }

  const currentIds: number[] =
    resolvedMediaType === "MANGA"
      ? (likedList.mangaIds ?? [])
      : (likedList.animeIds ?? []);
  const alreadyLiked = currentIds.includes(resolvedMediaId);

  if (alreadyLiked) {
    await Promise.all([
      List.updateOne(
        { _id: likedList._id },
        { $pull: { [listField]: resolvedMediaId } }
      ),
      Media.updateOne(
        { mediaId: resolvedMediaId, mediaType: resolvedMediaType },
        { $inc: { likesCount: -1 } }
      ),
    ]);

    return Response.json({ liked: false });
  }

  await Promise.all([
    List.updateOne(
      { _id: likedList._id },
      { $addToSet: { [listField]: resolvedMediaId } }
    ),
    Media.updateOne(
      { mediaId: resolvedMediaId, mediaType: resolvedMediaType },
      { $inc: { likesCount: 1 } }
    ),
  ]);

  return Response.json({ liked: true });
}
