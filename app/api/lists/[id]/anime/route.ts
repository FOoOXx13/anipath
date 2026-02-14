import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { List } from "@/lib/models/list";
import { fetchAnimeByIds } from "@/lib/anilist";

export async function GET(req: Request,{params}: {params: Promise<{id: string}>}){
    const {userId} = await auth();
    const { id } = await params;
    console.log("USER:", userId);
    console.log("LIST ID:", id);

    if(!userId){
        return new Response("Unauthorizised", {status:401})
    }

    await connectDB();

    const list = await List.findOne({
        _id: id,
        userId,
    }).lean();

    console.log("LIST FROM DB:", list);

    if(!list) {
        return new Response("List not found", {status:401})
    }

    console.log("ANIME IDS:", list.animeIds);

    const anime = await fetchAnimeByIds(list.animeIds);
    console.log("FETCHED ANIME:", anime?.length);

    return Response.json(anime);
}