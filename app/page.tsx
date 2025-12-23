"use client";
import CarouselSection from "@/components/carouselSection";
import { fetchTrendingAnime, fetchUpcomingAnime, fetchAllTimePopularAnime } from "./lib/anilist";

export default function  Home() {
 
  return (
   <main className="flex flex-col justify-center items-center py-10 gap-4 lg:gap-10">

      <div className="max-w-full mx-auto">
          <h2 className="text-2xl md:text-4xl mb-4 lg:mb-8 px-2 md:px-12 font-bold">TRENDING NOW</h2>
          <CarouselSection fetchMethod={fetchTrendingAnime} />
      </div>

      <div className="max-w-full mx-auto">
          <h2 className="text-2xl md:text-4xl mb-4 lg:mb-8 px-2 md:px-12 font-bold">UPCOMING NEXT SEASON</h2>
           <CarouselSection fetchMethod={fetchUpcomingAnime} />
      </div>

      <div className="max-w-full mx-auto">
          <h2 className="text-2xl md:text-4xl mb-4 lg:mb-8 px-2 md:px-12 font-bold">ALL TIME POPULAR </h2>
           <CarouselSection fetchMethod={fetchAllTimePopularAnime} />
         
      </div>

   </main>
  );
}
