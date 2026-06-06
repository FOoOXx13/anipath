import { fetchMediaById } from "@/lib/anilist";
import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import AnimeNavigationTabs from "@/components/AnimeNavigationTabs";

export default async function MangaLayout({
  params,
  children,
}: {
  params: any;
  children: ReactNode;
}) {
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

  const mangaLinks = manga.externalLinks ?? [];

  const navigationItems = [
    { title: "Overview", href: `overview` },
    { title: "Info", href: `info` },
    { title: "Comments", href: `comments` },
    { title: "Characters", href: `characters` },
    { title: "Staff", href: `staff` },
  ];

  return (
    <main>
      {manga.bannerImage && (
        <div className="relative w-full h-48 sm:h-64 md:h-96 lg:h-140 overflow-hidden">
          <Image
            src={manga.bannerImage}
            alt="banner"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      )}

      <div className="flex flex-col items-start px-4 sm:px-6 w-full">
        <div className="w-full max-w-[2000px] lg:mx-10 flex flex-col md:flex-row gap-6 md:gap-8">
          <div
            className={`w-full md:w-[230px] ${manga.bannerImage ? "mt-4 md:mt-8 " : "mt-4"} shrink-0 flex flex-col md:items-start`}
          >
            <div className="flex max-[600px]:flex-col gap-3">
              <div className="max-[600px]:flex justify-between ">
                <div
                  className={`${manga.bannerImage ? `max-[600px]:relative max-[600px]:z-10 max-[600px]:-mt-22` : `max-[600px]:block`}`}
                >
                  <Image
                    src={manga.coverImage.large}
                    alt="cover image"
                    width={230}
                    height={345}
                    className="rounded-2xl max-[600px]:max-w-[100px] "
                    priority
                  />
                </div>

                <div className="w-full  max-w-[230px] flex gap-2 md:flex-col mt-4 md:w-full">
                  <div className="flex items-start gap-2 md:w-full ">
                    <button className="max-[600px]:w-[100px]  w-[150px]  md:mt-3 bg-(--color-accent) px-3 py-2 rounded-lg md:rounded-2xl font-medium hover:opacity-90 transition-opacity">
                      like
                    </button>
                    <button className="max-[600px]:w-[60px] w-[72px] md:mt-3  bg-(--color-accent) px-3 py-2 rounded-lg md:rounded-2xl font-medium hover:opacity-90 transition-opacity">
                      like
                    </button>
                  </div>
                </div>
              </div>

              {/* manga info sm */}
              <div className="flex md:hidden flex-col gap-3 ">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold wrap-break-word">
                  {manga.title.english}
                </h1>
                {manga.genres && manga.genres.length > 0 && (
                  <div className="flex flex-col sm:flex-row mt-4 sm:items-center gap-2 sm:gap-4">
                    <span className="text-lg sm:text-xl font-bold shrink-0">
                      Genres:
                    </span>
                    <div className="text-(--color-muted) font-semibold flex flex-wrap items-center gap-2">
                      {manga.genres.map((genre) => (
                        <Link
                          href="#"
                          className="text-sm sm:text-base px-2 py-1 rounded-lg bg-bg-gray  "
                          key={genre}
                        >
                          {genre}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="text-lg sm:text-xl font-bold shrink-0">
                    Chapters:
                  </span>
                  <div className="text-(--color-muted) text-sm sm:text-base font-semibold flex items-center gap-2">
                    {manga.chapters ? manga.chapters : "N/A"}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="text-lg sm:text-xl font-bold shrink-0">
                    Volumes:
                  </span>
                  <div className="text-(--color-muted) text-sm sm:text-base font-semibold flex items-center gap-2">
                    {manga.volumes ? manga.volumes : "N/A"}
                  </div>
                </div>

                {mangaLinks.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-lg sm:text-xl font-bold">
                      Read on:
                    </span>
                    <div className="text-(--color-muted) text-sm sm:text-base font-semibold flex flex-wrap items-center gap-2">
                      {mangaLinks.map((link, index) => (
                        <Link
                          key={`${link.site}-${link.url}-${index}`}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium bg-bg-light text-foreground hover:opacity-90 transition-opacity"
                        >
                          {link.site}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* side info */}
            <div className="hidden md:flex flex-col justify-center my-4 w-[230px] ">
              <div className="  px-2 rounded-2xl">
                {manga.format && (
                  <div className="flex flex-col ">
                    <span className="text-xl font-bold">Format</span>
                    <span className="text-(--color-muted) font-semibold">
                      {manga.format}
                    </span>
                  </div>
                )}
              </div>

              <div className="">
                {manga.status && (
                  <div className="mt-4 px-2 flex flex-col ">
                    <span className="text-xl font-bold">Status</span>
                    <span className="text-(--color-muted) font-semibold">
                      {manga.status}
                    </span>
                  </div>
                )}
              </div>

              <div className="">
                <div className="flex flex-col mt-4 px-2">
                  <span className="text-xl font-bold">Chapters</span>
                  <span className="text-(--color-muted) font-semibold">
                    {manga.chapters ? manga.chapters : "N/A"}
                  </span>
                </div>
              </div>

              <div className="">
                <div className="flex flex-col mt-4 px-2">
                  <span className="text-xl font-bold">Volumes</span>
                  <span className="text-(--color-muted) font-semibold">
                    {manga.volumes ? manga.volumes : "N/A"}
                  </span>
                </div>
              </div>

              <div className="">
                {manga.startDate && (
                  <div className="flex flex-col mt-4 px-2">
                    <span className="text-xl font-bold">Start Date</span>
                    <span className="text-(--color-muted) font-semibold">
                      {" "}
                      {getMonthName(manga.startDate.month)}{" "}
                      {manga.startDate?.day} {manga.startDate?.year}
                    </span>
                  </div>
                )}
              </div>

              <div className="">
                {manga.endDate && (
                  <div className="flex flex-col mt-4 px-2">
                    <span className="text-xl font-bold">End date</span>
                    <span className="text-(--color-muted) font-semibold">
                      {getMonthName(manga.endDate.month)} {manga.endDate?.day}{" "}
                      {manga.endDate?.year}
                    </span>
                  </div>
                )}
              </div>

              <div className="">
                {manga.popularity && (
                  <div className="flex flex-col mt-4 px-2">
                    <span className="text-xl font-bold">Popularity</span>
                    <span className="text-(--color-muted) font-semibold">
                      {manga.popularity}
                    </span>
                  </div>
                )}
              </div>

              <div className="">
                {manga.studios?.nodes && manga.studios.nodes.length > 0 && (
                  <div className="flex flex-col mt-4 px-2">
                    <span className="text-xl font-bold">Studios</span>

                    <div className="text-(--color-muted) font-semibold flex flex-col">
                      {manga.studios.nodes.map((studio) => (
                        <span key={studio.id} className="">
                          {studio.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="">
                {manga.producers?.nodes &&
                  manga.producers.nodes.length > 0 && (
                    <div className="flex flex-col mt-4 px-2">
                      <span className="text-xl font-bold">Producers</span>

                      <div className="text-(--color-muted) font-semibold flex flex-col">
                        {manga.producers.nodes.map((producer) => (
                          <span key={producer.id}>{producer.name}</span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              <div className="">
                {manga.source && (
                  <div className="flex flex-col mt-4 px-2">
                    <span className="text-xl font-bold">Source</span>
                    <span className="text-(--color-muted) font-semibold">
                      {manga.source}
                    </span>
                  </div>
                )}
              </div>

              <div className="">
                {manga.hashtag && (
                  <div className="flex flex-col mt-4 px-2">
                    <span className="text-xl font-bold">Hashtag</span>
                    <span className="text-(--color-muted) font-semibold">
                      {manga.hashtag}
                    </span>
                  </div>
                )}
              </div>

              <div className="">
                {manga.title.romaji && (
                  <div className="flex flex-col mt-4 px-2">
                    <span className="text-xl font-bold">Romaji</span>
                    <span className="text-(--color-muted) font-semibold">
                      {manga.title.romaji}
                    </span>
                  </div>
                )}
              </div>

              <div className="">
                {manga.title.english && (
                  <div className="flex flex-col mt-4 px-2">
                    <span className="text-xl font-bold">English</span>
                    <span className="text-(--color-muted) font-semibold">
                      {manga.title.english}
                    </span>
                  </div>
                )}
              </div>

              <div className="">
                {manga.title.native && (
                  <div className="flex flex-col mt-4 px-2">
                    <span className="text-xl font-bold">Native</span>
                    <span className="text-(--color-muted) font-semibold">
                      {manga.title.native}
                    </span>
                  </div>
                )}
              </div>

              <div className="">
                {manga.synonyms && manga.synonyms.length > 0 && (
                  <div className="flex flex-col mt-4 px-2">
                    <span className="text-xl font-bold">Synonyms</span>
                    <div className="text-(--color-muted) font-semibold flex flex-col">
                      {manga.synonyms.map((synonym) => (
                        <span key={synonym}>{synonym}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={`flex-1 w-full flex flex-col gap-4 min-w-0`}>
            <div
              className={`flex flex-col min-h-16 md:min-h-82 justify-center gap-2 ${manga.bannerImage ? `mt-4 md:mt-5` : `mt-4`} `}
            >
              <div className="hidden md:flex flex-col gap-3 ">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold wrap-break-word">
                  {manga.title.english}
                </h1>
                {manga.genres && manga.genres.length > 0 && (
                  <div className="flex flex-col sm:flex-row mt-4 sm:items-center gap-2 sm:gap-4">
                    <span className="text-lg sm:text-xl font-bold shrink-0">
                      Genres:
                    </span>
                    <div className="text-(--color-muted) font-semibold flex flex-wrap items-center gap-2">
                      {manga.genres.map((genre) => (
                        <Link
                          href="#"
                          className="text-sm sm:text-base px-2 py-1 rounded-lg bg-bg-gray hover:bg-hover-gray text-foreground transition-colors "
                          key={genre}
                        >
                          {genre}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="text-lg sm:text-xl font-bold shrink-0">
                    Chapters:
                  </span>
                  <div className="text-(--color-muted) text-sm sm:text-base font-semibold flex items-center gap-2">
                    {manga.chapters ? manga.chapters : "N/A"}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="text-lg sm:text-xl font-bold shrink-0">
                    Volumes:
                  </span>
                  <div className="text-(--color-muted) text-sm sm:text-base font-semibold flex items-center gap-2">
                    {manga.volumes ? manga.volumes : "N/A"}
                  </div>
                </div>

                {mangaLinks.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-lg sm:text-xl font-bold">
                      Read on:
                    </span>
                    <div className="text-(--color-muted) text-sm sm:text-base font-semibold flex flex-wrap items-center gap-2">
                      {mangaLinks.map((link, index) => (
                        <Link
                          key={`${link.site}-${link.url}-${index}`}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-foreground sm:rounded-xl text-xs sm:text-sm font-medium bg-bg-light hover:opacity-90 transition-opacity"
                        >
                          {link.site}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-(--color-muted) text-sm sm:text-base leading-relaxed md:pr-10" dangerouslySetInnerHTML={{ __html: manga.description ?? "" }} />
            </div>

            {/* Navigation Tabs */}
            <AnimeNavigationTabs
              navigationItems={navigationItems}
              mediaId={manga.id}
              basePath="manga"
            />

            {/* Page Content */}
            <div className="min-h-100">{children}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
