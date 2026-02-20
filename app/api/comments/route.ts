import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { Comment } from "@/lib/models/comment";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { animeId, text } = await req.json();

  if (!animeId || !text?.trim()) {
    return new Response("Invalid data", { status: 400 });
  }

  await connectDB();

  const client = await clerkClient();
 const user = await client.users.getUser(userId);
 console.log("CLERK USER:", user);

  const comment = await Comment.create({
    userId,
    username: user.username || user.firstName || "User",
    imageUrl: user.imageUrl,
    animeId,
    text,
  });

  return Response.json({
    _id: comment._id.toString(),
    userId: comment.userId,
    username: comment.username,
    imageUrl: comment.imageUrl,
    animeId: comment.animeId,
    text: comment.text,
    createdAt: comment.createdAt,
  });
}