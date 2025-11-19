import Carousel from "@/components/Carousel";

export default function Home() {
   const cards = Array.from({ length: 10 }, (_, i) => (
    <div className="h-32 bg-purple-500 rounded-xl flex items-center justify-center text-white text-2xl">
      {i + 1}
    </div>
  ));
  return (
   <main className="">
        <Carousel items={cards} step={1} gap={16} visibleItems={8} />
   </main>
  );
}
