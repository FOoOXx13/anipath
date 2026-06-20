import Link from "next/link";
import { headers } from "next/headers";


async function getLists() {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(`${protocol}://${host}/api/lists`, {
    cache: "no-store",
    headers: {
      cookie: headersList.get("cookie") ?? "",
    },
  });

  if (!res.ok) {
    return []; 
  }

  return res.json();
}

export default async function ListsPage() {
    const lists = await getLists()

    if (lists.length === 0) {
  return <p className="p-6 text-gray-400">No lists yet 👀</p>;
}

  return (
   <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
  {lists.map((list: any) => (
    <Link key={list._id} href={`/lists/${list._id}`}>
      <div className="group bg-zinc-900 rounded-xl overflow-hidden cursor-pointer hover:scale-[1.03] transition">

        {/* Thumbnail */}
        <div className="relative h-40 w-full bg-zinc-800">
          {list.thumbnail ? (
            <img
              src={list.thumbnail}
              alt={list.name}
              className="w-full h-full object-cover group-hover:brightness-75 transition"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-gray-400">
              Empty list
            </div>
          )}

          {/* overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>

        {/* Info */}
        <div className="p-3">
          <h2 className="text-sm font-semibold line-clamp-2">
            {list.name}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {list.mediaCount} items
          </p>
        </div>
      </div>
    </Link>
  ))}
</div>
  )
}

