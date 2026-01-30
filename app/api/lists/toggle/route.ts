import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { List } from "@/lib/models/list";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { listId, animeId } = await req.json();

  if (!listId || typeof animeId !== "number") {
    return new Response("Invalid payload", { status: 400 });
  }

  await connectDB();

  const list = await List.findOne({ _id: listId, userId });
  if (!list) {
    return new Response("List not found", { status: 404 });
  }

  const alreadyInList = list.animeIds.includes(animeId);

  await List.updateOne(
    { _id: listId },
    alreadyInList
      ? { $pull: { animeIds: animeId } }
      : { $addToSet: { animeIds: animeId } }
  );

  return Response.json({ saved: !alreadyInList });
}
