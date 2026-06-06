import { fetchMediaById } from "@/lib/anilist";
import Link from "next/link";

export default async function OverviewPage({ params }: { params: any }) {
  const resolvedParams = await Promise.resolve(params);
  const manga = await fetchMediaById(Number(resolvedParams.id), "MANGA");

  if (!manga) {
    return <div>Manga not found</div>;
  }

  return (
    <div>
      <div className="mt-6 md:mt-10">
        {manga.relations?.edges && manga.relations.edges.length > 0 && (
          <h2 className="text-2xl sm:text-3xl font-bold">Relations</h2>
        )}
        <div className="flex gap-4 my-8 flex-wrap">
          {manga.relations?.edges?.map((edge: any) => (
            <Link
              key={edge.node.id}
              href={edge.node.id ? `/manga/${edge.node.id}/overview` : "#"}
              className="flex w-full sm:w-80 h-full bg-bg-light rounded-xl gap-4 p-4 sm:p-0"
            >
              {edge.node.coverImage?.large && (
                <div className="w-24 sm:w-30 h-24 sm:h-40 shrink-0">
                  <img
                    className="w-full h-full rounded-lg sm:rounded-xl shrink-0 object-cover"
                    src={edge.node.coverImage.large}
                    alt={edge.node.title?.romaji ?? "Relation cover"}
                  />
                </div>
              )}
              <div className="flex-1 sm:w-50 h-auto sm:h-40 flex flex-col gap-2">
                <span className="text-xs sm:text-sm mt-2">
                  {edge.relationType}
                </span>
                <span className="text-sm sm:text-md font-bold line-clamp-2">
                  {edge.node.title?.romaji.length > 40
                    ? `${edge.node.title?.romaji.substring(0, 40)}...`
                    : edge.node.title?.romaji}
                </span>
                <div className="mt-auto mb-2 flex gap-2 flex-wrap">
                  <span className="text-xs">{edge.node.type}</span>
                  <span className="text-xs">{edge.node.status}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
