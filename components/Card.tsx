import Link from "next/link";
import LikeBtn from "./LikeBtn";
import SaveListBtn from "./SaveListBtn";
import { useRouter } from "next/navigation";

interface CardProps {
  imageSrc?: string;
  animeTitle?: string | null;
  animeId?: number;
  genres?:string[];
  liked: boolean;
  saved: boolean;
}


const Card = ({ imageSrc = "", animeTitle = "", animeId, liked, saved, genres }: CardProps) => {
    const router = useRouter();
  return (
   <div className="w-full bg-bg-dark rounded-xl h-66 min-[1000px]:h-[400px] flex flex-col group relative ">
  <Link href={animeId ? `/anime/${animeId}` : "#"} className="relative overflow-hidden rounded-xl">
    {/* Image */}
    <img
      src={imageSrc}
      alt="anime title"
      className="w-full h-[180px] min-[1000px]:h-[300px] object-cover rounded-xl transition-transform duration-300 group-hover:scale-105 group-hover:brightness-80 transform-gpu"
      style={{ background: "var(--bg-light)", transformOrigin: "center top" }}
    />

    {/* Overlay */}
    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <div className="text-center font-bold gap-2 flex flex-wrap justify-center">
        {genres?.map((genre, idx) => (
          <div className="p-1" key={idx}>
            <span 
             onClick={() => router.push(`/genre/${genre.toLowerCase()}`)}
            className="bg-(--color-accent) rounded-2xl p-2"  >{genre}</span>
          </div>
    ))}
      </div>
    </div>
  </Link>

  {/* Title and Buttons */}
  <div className="w-full flex flex-col flex-1 px-1 min-[1001px]:px-4 my-2">
    <h3 className="text-sm line-clamp-2 leading-tight min-[1001px]:text-lg font-semibold">
      {animeTitle}
    </h3>

    <div className="mt-auto flex justify-end gap-2">
      {animeId && <LikeBtn animeId={animeId} initialLiked={liked} />}
      {animeId && <SaveListBtn animeId={animeId} />}
    </div>
  </div>
</div>
  );
};

export default Card;
