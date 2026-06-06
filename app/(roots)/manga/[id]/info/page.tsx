import { fetchMediaById } from "@/lib/anilist";

export default async function InfoPage({ params }: { params: any }) {
  const resolvedParams = await Promise.resolve(params);
  const manga = await fetchMediaById(Number(resolvedParams.id), "MANGA");

  if (!manga) {
    return <div>Manga not found</div>;
  }

  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  function getMonthName(month?: number) {
    if (!month) return null;
    return MONTHS[month - 1];
  }

  return (
    <div className="grid grid-cols-2 md:hidden justify-center my-4 w-full">
      <div className="px-2 rounded-2xl">
        {manga.format && (
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold">Format</span>
            <span className="text-(--color-muted) font-semibold text-sm sm:text-base">
              {manga.format}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 px-2 flex flex-col">
        {manga.status && (
          <div>
            <span className="text-lg sm:text-xl font-bold">Status</span>
            <span className="text-(--color-muted) font-semibold text-sm sm:text-base block">
              {manga.status}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 px-2 flex flex-col">
        <div>
          <span className="text-lg sm:text-xl font-bold">Chapters</span>
          <span className="text-(--color-muted) font-semibold text-sm sm:text-base block">
            {manga.chapters ? manga.chapters : "N/A"}
          </span>
        </div>
      </div>

      <div className="mt-4 px-2 flex flex-col">
        <div>
          <span className="text-lg sm:text-xl font-bold">Volumes</span>
          <span className="text-(--color-muted) font-semibold text-sm sm:text-base block">
            {manga.volumes ? manga.volumes : "N/A"}
          </span>
        </div>
      </div>

      <div className="mt-4 px-2 flex flex-col">
        {manga.startDate && (
          <div>
            <span className="text-lg sm:text-xl font-bold">Start Date</span>
            <span className="text-(--color-muted) font-semibold text-sm sm:text-base block">
              {" "}
              {getMonthName(manga.startDate.month)} {manga.startDate?.day}{" "}
              {manga.startDate?.year}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 px-2 flex flex-col">
        {manga.endDate && (
          <div>
            <span className="text-lg sm:text-xl font-bold">End date</span>
            <span className="text-(--color-muted) font-semibold text-sm sm:text-base block">
              {getMonthName(manga.endDate.month)} {manga.endDate?.day}{" "}
              {manga.endDate?.year}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 px-2 flex flex-col">
        {manga.popularity && (
          <div>
            <span className="text-lg sm:text-xl font-bold">Popularity</span>
            <span className="text-(--color-muted) font-semibold text-sm sm:text-base block">
              {manga.popularity}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 px-2 flex flex-col">
        {manga.studios?.nodes && manga.studios.nodes.length > 0 && (
          <div>
            <span className="text-lg sm:text-xl font-bold">Studios</span>
            <div className="text-(--color-muted) font-semibold flex flex-col text-sm sm:text-base">
              {manga.studios.nodes.map((studio: any) => (
                <span key={studio.id}>{studio.name}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 px-2 flex flex-col">
        {manga.producers?.nodes && manga.producers.nodes.length > 0 && (
          <div>
            <span className="text-lg sm:text-xl font-bold">Producers</span>
            <div className="text-(--color-muted) font-semibold flex flex-col text-sm sm:text-base">
              {manga.producers.nodes.map((producer: any) => (
                <span key={producer.id}>{producer.name}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 px-2 flex flex-col">
        {manga.source && (
          <div>
            <span className="text-lg sm:text-xl font-bold">Source</span>
            <span className="text-(--color-muted) font-semibold text-sm sm:text-base block">
              {manga.source}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 px-2 flex flex-col">
        {manga.hashtag && (
          <div>
            <span className="text-lg sm:text-xl font-bold">Hashtag</span>
            <span className="text-(--color-muted) font-semibold text-sm sm:text-base block break-all">
              {manga.hashtag}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 px-2 flex flex-col">
        {manga.title.romaji && (
          <div>
            <span className="text-lg sm:text-xl font-bold">Romaji</span>
            <span className="text-(--color-muted) font-semibold text-sm sm:text-base block wrap-break-word">
              {manga.title.romaji}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 px-2 flex flex-col">
        {manga.title.english && (
          <div>
            <span className="text-lg sm:text-xl font-bold">English</span>
            <span className="text-(--color-muted) font-semibold text-sm sm:text-base block wrap-break-word">
              {manga.title.english}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 px-2 flex flex-col">
        {manga.title.native && (
          <div>
            <span className="text-lg sm:text-xl font-bold">Native</span>
            <span className="text-(--color-muted) font-semibold text-sm sm:text-base block wrap-break-word">
              {manga.title.native}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 px-2 flex flex-col">
        {manga.synonyms && manga.synonyms.length > 0 && (
          <div>
            <span className="text-lg sm:text-xl font-bold">Synonyms</span>
            <div className="text-(--color-muted) font-semibold flex flex-col text-sm sm:text-base">
              {manga.synonyms.map((synonym: any) => (
                <span key={synonym} className="wrap-break-word">
                  {synonym}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
