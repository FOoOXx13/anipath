import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { List } from "@/lib/models/list";

export async function getSavedAnimeIds(): Promise<number[]> {
  const { userId } = await auth();
  if (!userId) return [];

  await connectDB();

  const savedList = await List.findOne(
    { userId, isDefault: true },
    { animeIds: 1, _id: 0 }
  ).lean();

  return savedList?.animeIds ?? [];
}
