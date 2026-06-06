import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
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
    const {userId} = await auth();

    if(!userId) {
          return new Response("Unauthorized", { status: 401 });
    }

    if (typeof resolvedMediaId !== "number") {
      return new Response("Invalid payload", { status: 400 });
    }

    await connectDB();

    let savedList = await List.findOne({
        userId,
        isDefault: true
    })

    if(!savedList) {
        savedList = await List.create({
            userId,
            name:"Saved",
            isDefault:true,
            animeIds:[],
            mangaIds:[],
        })
    }

const currentIds: number[] =
  resolvedMediaType === "MANGA"
    ? (savedList.mangaIds ?? [])
    : (savedList.animeIds ?? []);

const alreadySaved = currentIds.includes(resolvedMediaId);

const result = await List.findOneAndUpdate(
  { _id: savedList._id },
  alreadySaved
    ? { $pull: { [listField]: resolvedMediaId } }
    : { $addToSet: { [listField]: resolvedMediaId } },
  { new: true }
);

return Response.json({ saved: !alreadySaved });



}

