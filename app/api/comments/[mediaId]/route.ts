import connectDB from "@/lib/mongodb";
import { Comment } from "@/lib/models/comment";

export async function GET(req: Request, { params }: { params: Promise<{ mediaId: string }> }) {
  const { mediaId } = await params;

  await connectDB();

  const numericMediaId = Number(mediaId);

  const comments = await Comment.find({
    $or: [{ mediaId: numericMediaId }, { animeId: numericMediaId }],
  })
    .sort({ createdAt: -1 })
    .lean();

  return Response.json(
    comments.map((c: any) => ({
      _id: c._id.toString(),
      userId: c.userId,
      username: c.username,
      imageUrl: c.imageUrl,
      text: c.text,
      createdAt: c.createdAt,
    }))
  );
}
