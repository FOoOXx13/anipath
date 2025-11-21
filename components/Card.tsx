import Image from "next/image";

interface CardProps {
    imageSrc?: string;
    animeTitle?: string | null;
    animeSeason?: string | null;
    animeYear?: number | null;
    animeEpisodes?: number | null;
}


const Card = ({imageSrc = '',  animeTitle = '', animeYear, animeEpisodes }: CardProps) => {
  


  return (
     <div className="h-[400px] w-full bg-bg-dark rounded-xl flex flex-col items-center >">
      <img src={imageSrc} alt="" className="w-full h-[300px] bg-(--bg-light) rounded-xl " />
      <div className="w-full flex flex-col px-4">
        <h3 className="text-lg font-semibold ">{ animeTitle}</h3>
        <div className="w-full flex flex-col text-(--color-muted) ">
        <span>episodes: {animeEpisodes ? animeEpisodes : '?'}</span>
        <span className="text-sm">{animeYear}</span>
        </div>
      </div>
    </div>
  )
}



export default Card
