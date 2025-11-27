import TrendingSection, { UpcomingNextSeasonSection,AllTimePopularSection} from "@/components/animeSections";

export default async function  Home() {

   
 
  return (
   <main className="flex flex-col justify-center items-center py-20 gap-10">

      <div className="max-w-[1840px] mx-auto">
          <h2 className="text-4xl mb-8 px-12 font-bold">TRENDING NOW</h2>
          <TrendingSection/>
      </div>

      <div className="max-w-[1840px] mx-auto">
          <h2 className="text-4xl mb-8 px-12 font-bold">UPCOMING NEXT SEASON</h2>
          <UpcomingNextSeasonSection/>
      </div>

         <div className="max-w-[1840px] mx-auto">
          <h2 className="text-4xl mb-8 px-12 font-bold">ALL TIME POPULAR </h2>
          <AllTimePopularSection/>
      </div>

      
   </main>
  );
}
