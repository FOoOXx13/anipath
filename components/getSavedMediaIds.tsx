import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { List } from "@/lib/models/list";

export async function getSavedMediaIds(type: "ANIME" | "MANGA" = "ANIME"): Promise<number[]> {
  const { userId } = await auth();
  if (!userId) return [];

  await connectDB();

  const savedList = await List.findOne(
    { userId, isDefault: true, name: "Saved" },
    { animeIds: 1, mangaIds: 1, _id: 0 }
  ).lean();

  return type === "MANGA" ? (savedList?.mangaIds ?? []) : (savedList?.animeIds ?? []);
}

export async function getSavedAnimeIds(): Promise<number[]> {
  return getSavedMediaIds("ANIME");
}
