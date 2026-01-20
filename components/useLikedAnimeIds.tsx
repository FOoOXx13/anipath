import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { Anime } from "@/lib/models/anime";

export async function getLikedAnimeIds(): Promise<number[]> {
  const { userId } = await auth();

  if (!userId) return [];

  await connectDB();

  const docs = await Anime.find(
    { likes: userId },
    { animeId: 1, _id: 0 }
  ).lean();

  return docs.map((d) => d.animeId);
}
