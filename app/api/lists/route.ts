import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { List } from "@/lib/models/list";

export async function GET(req: Request) {
    const {userId} = await auth();
    if(!userId) {
        return new Response ("Unauthorized", {status: 401})
    }

    const {searchParams} = new URL(req.url);
        const mediaIdParam = searchParams.get("mediaId");
        const animeIdParam = searchParams.get("animeId");
        const mediaTypeParam = searchParams.get("mediaType");
        const mediaType = mediaTypeParam === "MANGA" ? "MANGA" : "ANIME";
        const mediaId = mediaIdParam
                ? Number(mediaIdParam)
                : animeIdParam
                    ? Number(animeIdParam)
                    : null;

    await connectDB();

    const lists = await List.find({userId}).lean();

    const response = lists.map(list => ({
        _id: list._id.toString(),
        name: list.name,
        isDefault: list.isDefault,
                contains: mediaId
                    ? mediaType === "MANGA"
                        ? (list.mangaIds ?? []).includes(mediaId)
                        : (list.animeIds ?? []).includes(mediaId)
                    : false,
    }))

    return Response.json(response)


}


export async function POST(req: Request) {
    const { name } = await req.json();
    const { userId } = await auth();

    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    if (!name || !name.trim()) {
        return new Response("List name is required", { status: 400 });
    }

    await connectDB();

    const newList = await List.create({
        userId,
        name: name.trim(),
        isDefault: false,
        animeIds: [],
        mangaIds: [],
    });

    return new Response(JSON.stringify(newList), {
        status: 201,
        headers: { "Content-Type": "application/json" },
    });
}
