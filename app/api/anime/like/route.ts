import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { Anime } from "@/lib/models/anime";


export async function POST(req: Request) {
const { animeId } = await req.json();
const { userId } = await auth();


if (!userId) {
return new Response("Unauthorized", { status: 401 });
}


await connectDB();

const anime = await Anime.findOne({animeId})

// toggle logic
if (anime?.likes.includes(userId)) {
  await Anime.updateOne(
    {animeId},
    {$pull: {likes:userId}}
  )
  

  return Response.json({ liked: false });
}

await Anime.findOneAndUpdate(
  { animeId },
  { $addToSet: { likes: userId } },
  { upsert: true }
);

return Response.json({ liked: true });
}