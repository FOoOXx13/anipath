import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { List } from "@/lib/models/list";

export async function getLikedMediaIds(type: "ANIME" | "MANGA" = "ANIME"): Promise<number[]> {
  const { userId } = await auth();
  if (!userId) return [];

  await connectDB();

  const list = await List.findOne({
    userId,
    name: "Liked",
    isDefault: true,
  }).lean();

  return type === "MANGA" ? (list?.mangaIds ?? []) : (list?.animeIds ?? []);
}

export async function getLikedAnimeIds(): Promise<number[]> {
  return getLikedMediaIds("ANIME");
}