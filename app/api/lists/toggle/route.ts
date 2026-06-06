import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { List } from "@/lib/models/list";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { listId, mediaId, animeId, mediaType } = await req.json();
  const resolvedMediaType = mediaType === "MANGA" ? "MANGA" : "ANIME";
  const resolvedMediaId =
    typeof mediaId === "number"
      ? mediaId
      : typeof animeId === "number"
        ? animeId
        : null;

  if (!listId || typeof resolvedMediaId !== "number") {
    return new Response("Invalid payload", { status: 400 });
  }

  await connectDB();

  const list = await List.findOne({ _id: listId, userId });
  if (!list) {
    return new Response("List not found", { status: 404 });
  }

  const field = resolvedMediaType === "MANGA" ? "mangaIds" : "animeIds";
  const existingIds: number[] =
    resolvedMediaType === "MANGA" ? (list.mangaIds ?? []) : (list.animeIds ?? []);
  const alreadyInList = existingIds.includes(resolvedMediaId);

  await List.updateOne(
    { _id: listId },
    alreadyInList
      ? { $pull: { [field]: resolvedMediaId } }
      : { $addToSet: { [field]: resolvedMediaId } }
  );

  return Response.json({ saved: !alreadyInList });
}
