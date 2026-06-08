
import Link from "next/link";
import LikeBtn from "./LikeBtn";
import SaveListBtn from "./SaveListBtn";
import GenreTag from "./GenreTag";
import { MediaType } from "@/lib/anilist";

interface CardProps {
  imageSrc?: string;
  mediaTitle?: string | null;
  mediaId?: number;
  genres?: string[];
  liked: boolean;
  saved: boolean;
  type: MediaType; 
  color?: string | null;
}


const Card = ({ imageSrc = "", mediaTitle = "", mediaId, liked, saved, genres,type,color }: CardProps) => {

  const basePath = type === "ANIME" ? "anime" : "manga";
  
  return (
   <div className="w-full bg-bg-dark rounded-xl h-66 min-[1000px]:h-[400px] flex flex-col group relative ">
  <Link href={mediaId ? `/${basePath}/${mediaId}/overview` : "#"} className="relative block w-full overflow-hidden rounded-xl">
    {/* Image */}
    <img
      src={imageSrc}
      alt={mediaTitle || "anime title"}
      className="w-full h-[180px] min-[1000px]:h-[300px] object-cover rounded-xl"
      loading="lazy"
      decoding="async"
      style={{ background: "var(--bg-light)" }}
    />

  {/* Overlay */}
  <div className="pointer-events-none absolute inset-0 rounded-xl bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

  <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
    <div className="text-center font-bold gap-2 flex flex-wrap justify-center">
      {genres?.map((genre, idx) => (
        <div className="p-1" key={idx}>
          <GenreTag genre={genre} color={color}/>
        </div>
      ))}
    </div>
  </div>

  </Link>

  {/* Title and Buttons */}
  <div className="w-full flex flex-col flex-1 px-1 min-[1001px]:px-4 my-2">
    <h3 className="text-sm line-clamp-2 leading-tight min-[1001px]:text-lg font-semibold">
      {mediaTitle}
    </h3>

    <div className="mt-auto flex justify-end gap-2">
      {mediaId && <LikeBtn mediaId={mediaId} mediaType={type} initialLiked={liked} />}
      {mediaId && <SaveListBtn mediaId={mediaId} mediaType={type} />}
    </div>
  </div>
</div>
  );
};

export default Card;
