// CarouselSection.tsx
"use client";

import Card from "@/components/Card";
import Carousel from "@/components/Carousel";
import { Anime } from "../app/lib/anilist";
import { useState, useLayoutEffect } from "react";

interface CarouselSectionProps {
  animeList: Anime[];
}

export default function CarouselSection({ animeList }: CarouselSectionProps) {
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const [cardCount, setCardCount] = useState<number | null>(null);

  // Measure BEFORE paint
  useLayoutEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      setWindowWidth(width);

      // your logic for card count:
      const cards = width <= 1001
        ? Math.max(1, Math.floor(width / 140)) // example mobile formula
        : Math.max(1, Math.floor(width / 240)); // desktop

      setCardCount(cards);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ⛔ Avoid rendering until ready
  if (windowWidth === null || cardCount === null) {
    return <div style={{ height: 420 }} />; // skeleton space (optional)
  }

  const isMobile = windowWidth <= 1001;

  const items = animeList.map((anime) => {
    const title = anime.title.english || anime.title.romaji;
    const short = title.length > 20 ? title.slice(0, 30) + "..." : title;
    const shorter = title.length > 15 ? title.slice(0, 24) + "..." : title;

    return (
      <Card
        key={anime.id}
        animeId={anime.id}
        imageSrc={anime.coverImage.large}
        animeTitle={isMobile ? shorter : short}
        animeYear={anime.seasonYear}
        animeEpisodes={anime.episodes}
        cardHeight={isMobile ? 280 : 400}
        imageHeight={isMobile ? 180 : 300}
      />
    );
  });

  return (
    <Carousel
      cardFixedWidth={isMobile ? 120 : 200}
      items={items}
      step={cardCount}
      gap={isMobile ? 12 : 16}
      visibleItems={cardCount}
    />
  );
}
