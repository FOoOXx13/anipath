import Link from "next/link";

interface CardProps {
    imageSrc?: string;
    animeTitle?: string | null;
    animeSeason?: string | null;
    animeYear?: number | null;
    animeEpisodes?: number | null;
    cardHeight?: number;
    imageHeight?: number;
    animeId?: number;
}


const Card = ({imageSrc = '',  animeTitle = '', animeYear, animeEpisodes, cardHeight = 400, imageHeight = 300, animeId,  }: CardProps) => {
  // common card class
  // h-[400px] w-full bg-bg-dark rounded-xl flex flex-col items-center 

  return (
    <div className="w-full bg-bg-dark rounded-xl"
    style={{ height: cardHeight }}>

     <Link
       href={animeId ? `/anime/${animeId}` : '#'}
     >
      <img
        src={imageSrc}
        alt=""
        className="w-full rounded-xl object-cover"
        style={{ height: imageHeight, width: '100%', objectFit: 'cover', background: 'var(--bg-light)' }}
      />
      <div className="w-full flex flex-col px-1 md:px-4  ">
        <h3 className="text-sm md:text-lg  font-semibold ">{ animeTitle}</h3>
        <div className="w-full flex flex-col text-(--color-muted) ">
        <span>episodes: {animeEpisodes ? animeEpisodes : '?'}</span>
        <span className="text-sm">{animeYear}</span>
        </div>
      </div>
    </Link>
    </div>
  )
}



export default Card
