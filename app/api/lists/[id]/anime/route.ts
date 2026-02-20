import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { List } from "@/lib/models/list";
import { fetchAnimeByIds } from "@/lib/anilist";

export async function GET(req: Request,{params}: {params: Promise<{id: string}>}){
    const {userId} = await auth();
    const { id } = await params;


    if(!userId){
        return new Response("Unauthorizised", {status:401})
    }

    await connectDB();

    const list = await List.findOne({
        _id: id,
        userId,
    }).lean();


    if(!list) {
        return new Response("List not found", {status:401})
    }

    
    const anime = await fetchAnimeByIds(list.animeIds);

    return Response.json({
    _id: list._id.toString(), 
    name: list.name,
    anime,
    isDefault: list.isDefault,
    });

}