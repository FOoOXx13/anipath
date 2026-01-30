
import { fetchAnimeById } from "@/lib/anilist"
import AnimePageInfo from "@/components/AnimePageInfo";
import Link from "next/link";
import Image from "next/image";


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
    icon: "/icons/crunchyroll.svg",
  },
  Netflix: {
    label: "Netflix",
    brandColor: "#E50914",
    icon: "/icons/netflix.svg",
  },
  YouTube: {
    label: "YouTube",
    brandColor: "#FF0000",
    icon: "/icons/youtube.svg",
  },
  HIDIVE: {
    label: "HIDIVE",
    brandColor: "#00AEEF",
    icon: "/icons/hidive.svg",
  },
  "Bilibili TV": {
    label: "Bilibili",
    brandColor: "#00A1D6",
    icon: "/icons/bilibili.svg",
  },
  "Disney Plus": {
    label: "Disney+",
    brandColor: "#113CCF",
    icon: "/icons/disneyplus.svg",
  },
  Funimation: {
    label: "Funimation",
    brandColor: "#5B2D90",
    icon: "/icons/funimation.svg",
  },
  Wakanim: {
    label: "Wakanim",
    brandColor: "#FF0050",
    icon: "/icons/wakanim.svg",
  },
  "Amazon Prime Video": {
    label: "Prime Video",
    brandColor: "#00A8E1",
    icon: "/icons/primevideo.svg",
  },
  "Muse Asia": {
    label: "Muse Asia",
    brandColor: "#F6A623",
    icon: "/icons/museasia.svg",
  },
  "Ani-One Asia": {
    label: "Ani-One Asia",
    brandColor: "#F5A623",
    icon: "/icons/anione.svg",
  },
  "Tencent Video": {
    label: "Tencent Video",
    brandColor: "#2FB1F2",
    icon: "/icons/tencent.svg",
  },
  IQIYI: {
    label: "iQIYI",
    brandColor: "#00C300",
    icon: "/icons/iqiyi.svg",
  },
  "ABEMA Video": {
    label: "Abema",
    brandColor: "#000000",
    icon: "/icons/abema.svg",
  },
  "d Anime Store": {
    label: "d Anime Store",
    brandColor: "#FF6600",
    icon: "/icons/danime.svg",
  },
  Hulu: {
    label: "Hulu",
    brandColor: "#1CE783",
    icon: "/icons/hulu.svg",
  },
  VRV: {
    label: "VRV",
    brandColor: "#F5C518",
    icon: "/icons/vrv.svg",
  },
  "U-NEXT": {
    label: "U-NEXT",
    brandColor: "#0061AE",
    icon: "/icons/unext.svg",
  },
  "Official Site": {
    label: "Official Site",
    brandColor: "#4B5563",
    icon: "/icons/link.svg",
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

      <div>
        
      </div>
      {anime.bannerImage ? 
      <Image src={anime.bannerImage} alt="banner image" width={1920} height={480}  className="w-full relative mask-image-to-bottom "/> : 
      <div className="w-full mt-16"></div>}

      <div className="flex flex-col justify-center items-center">

      <div className="w-9/10 flex ">
        
          <div className={`w-[230px] ${anime.bannerImage ? 'mt-8' :""} shrink-0 `}>
              <img src={anime.coverImage.large} alt="cover image"  className="rounded-2xl"/>

              <div className="w-full flex justify-between">

                  <button className="bg-(--color-accent)  w-1/2 text-xl p-2 mt-4 rounded-2xl">Add to list</button>

                  <div className="w-1/2 mt-4 text-xl flex">
                  <button className="ml-3 bg-(--color-accent) p-2 rounded-2xl"> like</button>
                  <button className="ml-2 bg-(--color-accent) p-2 rounded-2xl"> like</button>
                  </div>

              </div>

          {/* side info */}
          <div className="flex flex-col justify-center my-4 w-[230px]">

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

           <div className={`  mx-16 flex flex-col gap-4`} >

            <div className='flex flex-col min-h-82 justify-center gap-2 '>
                  <h1 className="text-3xl font-bold">{anime.title.english}</h1>
                  <div className="text-(--color-muted)" dangerouslySetInnerHTML={{ __html: anime.description ?? "" }} />
                  <div className="flex flex-col gap-2">
                  {anime.genres && anime.genres.length > 0 && (
                  <div className="flex mt-4 items-center gap-4">
                    <span className="text-xl font-bold">Genres:</span>
                    <div className="text-(--color-muted) font-semibold flex items-center gap-2">
                      {anime.genres.map((genre) => (
                        <Link href="#" className="text-md " key={genre}>{genre}</Link>
                      ))}
                    </div>
                  </div>
                    )}
                    <div className="flex items-center gap-4">
                    <span className="text-xl font-bold">Episodes:</span>
                  <div className="text-(--color-muted) text-md  font-semibold flex items-center gap-2">
                    {anime.episodes ? anime.episodes : "N/A"}
                  </div>

                    </div>

                    <div className="flex items-center gap-4">
                    <span className="text-xl font-bold">Episode duration:</span>
                  <div className="text-(--color-muted) text-md  font-semibold flex items-center gap-2">
                    {anime.duration ? `${anime.duration} mins` : "N/A"}
                  </div>
                    </div>

                    <div className="flex items-center gap-4">
                  <div className="text-(--color-muted) text-md  font-semibold flex items-center gap-2">
                     {streamingLinks.map(link => {
                    const meta = PLATFORM_META[link.site];

                    return (
                      <Link
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1 rounded-xl text-white"
                        style={{ background: meta.brandColor }}
                      >
                        {meta.icon && (
                          <img src={meta.icon} className="w-5 h-5" />
                        )}
                        <span>{meta.label}</span>
                      </Link>
                    );
                  })}
                  </div>
                    </div>
              
            </div>
            </div>

                  <AnimePageInfo currentAnime={anime} />
                  
          </div>


      </div>

      <div className="w-9/10 flex">

    
            
      </div>

      </div>
      
    </main>
  );
}
