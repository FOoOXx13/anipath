import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { List } from "@/lib/models/list";

export async function POST(req: Request) {
    const {animeId} = await req.json();
    const {userId} = await auth();

    if(!userId) {
          return new Response("Unauthorized", { status: 401 });
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
        })
    }

const alreadySaved = savedList.animeIds.includes(animeId);

const result = await List.findOneAndUpdate(
  { _id: savedList._id },
  alreadySaved
    ? { $pull: { animeIds: animeId } }
    : { $addToSet: { animeIds: animeId } },
  { new: true }
);

return Response.json({ saved: !alreadySaved });



}

