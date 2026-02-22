
import { fetchAnimeById } from "@/lib/anilist"
import AnimePageInfo from "@/components/AnimePageInfo";
import Link from "next/link";
import Image from "next/image";
import CommentSection from "@/components/CommentsSection";


export default async function AnimePage({ params }: { params: any }) {

  const resolvedParams = await Promise.resolve(params);
 const anime = await fetchAnimeById(Number(resolvedParams.id));

if (!anime) {
  return <div>Anime not found</div>;
}


  

   const PLATFORM_META: Record<string, {
  label: string;
  brandColor: string;
  icon?: string;
}> = {
  Crunchyroll: {
    label: "Crunchyroll",
    brandColor: "#F47521",
    icon: "/icons/crunchyroll.png",
  },
  Netflix: {
    label: "Netflix",
    brandColor: "#E50914",
    icon: "/icons/netflix.png",
  },
  YouTube: {
    label: "YouTube",
    brandColor: "#FF0000",
    icon: "/icons/youtube.png",
  },
  HIDIVE: {
    label: "HIDIVE",
    brandColor: "#00AEEF",
    icon: "/icons/hidive.svg",
  },
  "Bilibili TV": {
    label: "Bilibili",
    brandColor: "#00A1D6",
    icon: "/icons/bilibili.png",
  },
  "Disney Plus": {
    label: "Disney+",
    brandColor: "#113CCF",
    icon: "/icons/disneyplus.png",
  },
  Funimation: {
    label: "Funimation",
    brandColor: "#5B2D90",
    icon: "/icons/funimation.png",
  },
  Wakanim: {
    label: "Wakanim",
    brandColor: "#FF0050",
    icon: "/icons/wakanim.png",
  },
  "Amazon Prime Video": {
    label: "Prime Video",
    brandColor: "#00A8E1",
    icon: "/icons/primevideo.png",
  },
  "Muse Asia": {
    label: "Muse Asia",
    brandColor: "#F6A623",
    icon: "/icons/museasia.png",
  },
  "Ani-One Asia": {
    label: "Ani-One Asia",
    brandColor: "#F5A623",
    icon: "/icons/anione.png",
  },
  "Tencent Video": {
    label: "Tencent Video",
    brandColor: "#2FB1F2",
    icon: "/icons/tencent.png",
  },
  IQIYI: {
    label: "iQIYI",
    brandColor: "#00C300",
    icon: "/icons/iqiyi.png",
  },
  "ABEMA Video": {
    label: "Abema",
    brandColor: "#000000",
    icon: "/icons/abema.png",
  },
  "d Anime Store": {
    label: "d Anime Store",
    brandColor: "#FF6600",
    icon: "/icons/danime.png",
  },
  Hulu: {
    label: "Hulu",
    brandColor: "#1CE783",
    icon: "/icons/hulu.png",
  },
  VRV: {
    label: "VRV",
    brandColor: "#F5C518",
    icon: "/icons/vrv.png",
  },
  "U-NEXT": {
    label: "U-NEXT",
    brandColor: "#0061AE",
    icon: "/icons/unext.png",
  },
  "Official Site": {
    label: "Official Site",
    brandColor: "#4B5563",
    icon: "/icons/link.png  ",
  },
};

const streamingLinks = (anime.externalLinks ?? [])
  .filter(l => PLATFORM_META[l.site]);



  if (!anime) return <div>Anime not found</div>;



  const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function getMonthName(month?: number) {
  if (!month) return null;
  return MONTHS[month - 1];
}

  return (
    <main>


      {anime.bannerImage && (
      <div className="relative w-full h-48 sm:h-64 md:h-96 lg:h-140 overflow-hidden">
        <Image
          src={anime.bannerImage}
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
        
          <div className={`w-full md:w-[230px] ${anime.bannerImage ? 'mt-4 md:mt-8' : 'mt-4'} shrink-0 flex flex-col md:items-start`}>
              <Image src={anime.coverImage.large} alt="cover image" width={230} height={345} className="rounded-2xl w-full max-w-[115px] sm:max-w-[230px] h-auto" priority/>

              <div className="w-full max-w-[230px] flex gap-2 md:flex-col mt-4 md:w-full">

                  <button className="flex-1 md:w-full bg-(--color-accent) text-sm sm:text-base md:text-lg px-3 py-2 rounded-lg md:rounded-2xl font-medium hover:opacity-90 transition-opacity">Add to list</button>

                  <div className="flex gap-2 md:gap-0 md:w-full">
                  <button className="flex-1 md:w-1/2 md:mt-3 bg-(--color-accent) px-3 py-2 rounded-lg md:rounded-2xl font-medium hover:opacity-90 transition-opacity">like</button>
                  <button className="flex-1 md:w-1/2 md:mt-3 md:ml-3 bg-(--color-accent) px-3 py-2 rounded-lg md:rounded-2xl font-medium hover:opacity-90 transition-opacity">like</button>
                  </div>

              </div>

          {/* side info */}
          <div className="hidden md:flex flex-col justify-center my-4 w-[230px] ">

            <div className="  px-2 rounded-2xl">
                {anime.format && (
                  <div className="flex flex-col ">
                    <span className="text-xl font-bold">Format</span>
                    <span className="text-(--color-muted) font-semibold">{anime.format}</span>
                  </div>
                )}
            </div>

            <div className="">
                {anime.status && (
                  <div className="mt-4 px-2 flex flex-col ">
                    <span className="text-xl font-bold">Status</span>
                    <span className="text-(--color-muted) font-semibold">{anime.status}</span>
                  </div>
                )}
            </div>

            <div className="">
                {anime.season && (
                  <div className="flex flex-col mt-4 px-2">
                    <span className="text-xl font-bold">Season</span>
                    <span className="text-(--color-muted) font-semibold">{anime.season} {anime.seasonYear}</span>
                  </div>
                )}
            </div>

            <div className="">
                {anime.startDate && (
                  <div className="flex flex-col mt-4 px-2">
                    <span className="text-xl font-bold">Start Date</span>
                    <span className="text-(--color-muted) font-semibold"> {getMonthName(anime.startDate.month)} {anime.startDate?.day} {anime.startDate?.year}</span>
                  </div>
                )}
            </div>

            <div className="">
                {anime.endDate && (
                  <div className="flex flex-col mt-4 px-2">
                    <span className="text-xl font-bold">End date</span>
                    <span className="text-(--color-muted) font-semibold">{getMonthName(anime.endDate.month)}  {anime.endDate?.day} {anime.endDate?.year}</span>
                  </div>
                )}
            </div>

            <div className="">
                {anime.popularity && (
                  <div className="flex flex-col mt-4 px-2">
                    <span className="text-xl font-bold">Popularity</span>
                    <span className="text-(--color-muted) font-semibold">{anime.popularity}</span>
                  </div>
                )}
            </div>

            <div className="">
                {anime.studios?.nodes && anime.studios.nodes.length > 0 && (
                <div className="flex flex-col mt-4 px-2">
                  <span className="text-xl font-bold">Studios</span>

                  <div className="text-(--color-muted) font-semibold flex flex-col">
                    {anime.studios.nodes.map(studio => (
                      <span key={studio.id} className="">
                        {studio.name}
                      </span>
                    ))}
                  </div>
                </div>
                )}  
            </div>

            
            <div className="">
              {anime.producers?.nodes && anime.producers.nodes.length > 0 && (
                <div className="flex flex-col mt-4 px-2">
                  <span className="text-xl font-bold">Producers</span>

                  <div className="text-(--color-muted) font-semibold flex flex-col">
                    {anime.producers.nodes.map((producer) => (
                      <span key={producer.id}>
                        {producer.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

             <div className="">
                {anime.source && (
                  <div className="flex flex-col mt-4 px-2">
                    <span className="text-xl font-bold">Source</span>
                    <span className="text-(--color-muted) font-semibold">{anime.source}</span>
                  </div>
                )}
            </div>

             <div className="">
                {anime.hashtag && (
                  <div className="flex flex-col mt-4 px-2">
                    <span className="text-xl font-bold">Hashtag</span>
                    <span className="text-(--color-muted) font-semibold">{anime.hashtag}</span>
                  </div>
                )}
            </div>

          

            <div className="">
                {anime.title.romaji && (
                  <div className="flex flex-col mt-4 px-2">
                    <span className="text-xl font-bold">Romaji</span>
                    <span className="text-(--color-muted) font-semibold">{anime.title.romaji}</span>
                  </div>
                )}
            </div>

            <div className="">
                {anime.title.english && (
                  <div className="flex flex-col mt-4 px-2">
                    <span className="text-xl font-bold">English</span>
                    <span className="text-(--color-muted) font-semibold">{anime.title.english}</span>
                  </div>
                )}
            </div>

            <div className="">
                {anime.title.native && (
                  <div className="flex flex-col mt-4 px-2">
                    <span className="text-xl font-bold">Native</span>
                    <span className="text-(--color-muted) font-semibold">{anime.title.native}</span>
                  </div>
                )}
            </div>

            <div className="">
                {anime.synonyms && anime.synonyms.length > 0 && (
                  <div className="flex flex-col mt-4 px-2">
                    <span className="text-xl font-bold">Synonyms</span>
                    <div className="text-(--color-muted) font-semibold flex flex-col">
                      {anime.synonyms.map((synonym) => (
                        <span key={synonym}>{synonym}</span>
                      ))}
                    </div>
                  </div>
                )}
            </div>



          </div>

              
          </div>

           <div className={`flex-1 w-full flex flex-col gap-4 min-w-0`} >

            <div className={`flex flex-col min-h-40 md:min-h-82 justify-center gap-2 ${anime.bannerImage ? `mt-4 md:mt-5` : `mt-4`} `}>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold wrap-break-word">{anime.title.english}</h1>
                  <div className="flex flex-col gap-3">
                  {anime.genres && anime.genres.length > 0 && (
                  <div className="flex flex-col sm:flex-row mt-4 sm:items-center gap-2 sm:gap-4">
                    <span className="text-lg sm:text-xl font-bold shrink-0">Genres:</span>
                    <div className="text-(--color-muted) font-semibold flex flex-wrap items-center gap-2">
                      {anime.genres.map((genre) => (
                        <Link href="#" className="text-sm sm:text-base px-2 py-1 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors" key={genre}>{genre}</Link>
                      ))}
                    </div>
                  </div>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="text-lg sm:text-xl font-bold shrink-0">Episodes:</span>
                  <div className="text-(--color-muted) text-sm sm:text-base font-semibold flex items-center gap-2">
                    {anime.episodes ? anime.episodes : "N/A"}
                  </div>

                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="text-lg sm:text-xl font-bold shrink-0">Episode duration:</span>
                  <div className="text-(--color-muted) text-sm sm:text-base font-semibold flex items-center gap-2">
                    {anime.duration ? `${anime.duration} mins` : "N/A"}
                  </div>
                    </div>

                    {streamingLinks.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="text-lg sm:text-xl font-bold">Watch on:</span>
                  <div className="text-(--color-muted) text-sm sm:text-base font-semibold flex flex-wrap items-center gap-2">
                     {streamingLinks.map(link => {
                    const meta = PLATFORM_META[link.site];

                    return (
                      <Link
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-white text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity"
                        style={{ background: meta.brandColor }}
                      >
                        {meta.icon && (
                          <img src={meta.icon} className="w-4 h-4 sm:w-5 sm:h-5" alt={meta.label} />
                        )}
                        <span>{meta.label}</span>
                      </Link>
                    );
                  })}
                  </div>
                    </div>
                    )}
                  <div className="text-(--color-muted) text-sm sm:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: anime.description ?? "" }} />
              
            </div>
            </div>

                  <AnimePageInfo currentAnime={anime} />
                  
          </div>


      </div>

      <div className="w-full max-w-7xl">

            
      </div>

      </div>
      
    </main>
  );
}
