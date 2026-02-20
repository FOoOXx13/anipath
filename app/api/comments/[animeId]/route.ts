import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { Comment } from "@/lib/models/comment";

export async function GET(req: Request,{params}: {params: Promise<{animeId:string}>}){

    const {animeId} = await params;

    await connectDB();

    const comments = await Comment.find({
        animeId: Number(animeId),
    }).sort({createdAt: -1}).lean()

 return Response.json(
  comments.map((c) => ({
    _id: c._id.toString(),
    userId: c.userId,
    username: c.username,
    imageUrl: c.imageUrl,
    text: c.text,
    createdAt: c.createdAt,
  }))
);
}