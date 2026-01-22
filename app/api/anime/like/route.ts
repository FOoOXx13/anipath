import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { Anime } from "@/lib/models/anime";
import { List } from "@/lib/models/list";

export async function POST(req: Request) {
  const { animeId } = await req.json();
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  await connectDB();

  // 1️⃣ Ensure anime exists
  await Anime.findOneAndUpdate(
    { animeId },
    { $setOnInsert: { animeId, likesCount: 0 } },
    { upsert: true }
  );

  // 2️⃣ Get or create "Liked" list
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
    });
  }

  const alreadyLiked = likedList.animeIds.includes(animeId);

  // 3️⃣ Toggle list + counter (atomic intent)
  if (alreadyLiked) {
    await Promise.all([
      List.updateOne(
        { _id: likedList._id },
        { $pull: { animeIds: animeId } }
      ),
      Anime.updateOne(
        { animeId },
        { $inc: { likesCount: -1 } }
      ),
    ]);

    return Response.json({ liked: false });
  }

  await Promise.all([
    List.updateOne(
      { _id: likedList._id },
      { $addToSet: { animeIds: animeId } }
    ),
    Anime.updateOne(
      { animeId },
      { $inc: { likesCount: 1 } }
    ),
  ]);

  return Response.json({ liked: true });
}
