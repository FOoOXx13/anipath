import { fetchMediaById } from "@/lib/anilist";
import CommentSection from "@/components/CommentsSection";

export default async function CommentsPage({ params }: { params: any }) {
  const resolvedParams = await Promise.resolve(params);
  const manga = await fetchMediaById(Number(resolvedParams.id), "MANGA");

  if (!manga) {
    return <div>Manga not found</div>;
  }

  return (
    <div className="min-h-100">
      <CommentSection mediaId={manga.id} />
    </div>
  );
}
