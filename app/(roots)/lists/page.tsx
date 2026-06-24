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
  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-10 flex justify-center">
      <p className="text-sm sm:text-base text-(--color-muted)">No lists yet</p>
    </div>
  );
}

  return (
   <section className="w-full  sm:px-6 lg:px-10  flex flex-col px-4 md:px-8 xl:px-16 py-6 mt-6">
  <div className="flex items-center justify-between mb-4 sm:mb-6">
    <h1 className="text-2xl min-[1001px]:text-4xl font-bold mb-4 text-center md:text-left">My Lists</h1>
    <span className="text-xs sm:text-sm text-(--color-muted)">{lists.length} lists</span>
  </div>

  <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-5">
    {lists.map((list: any) => {
      const itemCount = Number.isFinite(list.mediaCount) ? list.mediaCount : 0;

      return (
      <Link
        key={list._id}
        href={`/lists/${list._id}`}
        className="w-[170px] sm:w-[190px] md:w-[210px] lg:w-[220px]"
      >
        <div className="group h-full bg-bg-dark rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-200">
          <div className="relative h-40 sm:h-44 md:h-48 lg:h-52 w-full bg-bg-dark">
            {list.thumbnail ? (
              <img
                src={list.thumbnail}
                alt={list.name}
                className="w-full h-full object-cover group-hover:brightness-75 transition"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-xs sm:text-sm text-(--color-muted)">
                {itemCount === 0 ? "Empty list" : "No preview"}
              </div>
            )}

            <div className="absolute inset-0 bg-linear-to-t from-black/65 to-transparent" />
          </div>

          <div className="p-2.5 sm:p-3">
            <h2 className="text-xs sm:text-sm font-semibold line-clamp-2 min-h-9">
              {list.name}
            </h2>
            <p className="text-[11px] sm:text-xs text-(--color-muted) mt-1">
              {itemCount} items
            </p>
          </div>
        </div>
      </Link>
      );
    })}
  </div>
</section>
  )
}

