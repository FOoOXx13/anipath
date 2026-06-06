import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { Comment } from "@/lib/models/comment";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { animeId, mediaId, text } = await req.json();
  const resolvedMediaId =
    typeof mediaId === "number"
      ? mediaId
      : typeof animeId === "number"
        ? animeId
        : null;

  if (!resolvedMediaId || !text?.trim()) {
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
    mediaId: resolvedMediaId,
    text,
  });

  return Response.json({
    _id: comment._id.toString(),
    userId: comment.userId,
    username: comment.username,
    imageUrl: comment.imageUrl,
    mediaId: comment.mediaId,
    text: comment.text,
    createdAt: comment.createdAt,
  });
}