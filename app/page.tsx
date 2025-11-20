import TrendingSection, { UpcomingNextSeasonSection,AllTimePopularSection} from "@/components/animeSections";

export default async function  Home() {

   
 
  return (
   <main className="flex flex-col justify-center items-center py-20 gap-20">

      <div className="w-[1820px]">
          <h2 className="text-4xl mb-8 px-12 font-bold">TRENDING ANIME</h2>
          <TrendingSection/>
      </div>

      <div className="w-[1820px]">
          <h2 className="text-4xl mb-8 px-12 font-bold">UPCOMING NEXT SEASON ANIME</h2>
          <UpcomingNextSeasonSection/>
      </div>

         <div className="w-[1820px]">
          <h2 className="text-4xl mb-8 px-12 font-bold">ALL TIME POPULAR ANIME</h2>
          <AllTimePopularSection/>
      </div>

      
   </main>
  );
}
