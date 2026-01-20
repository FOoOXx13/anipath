"use client";

import Card from "@/components/Card";
import Carousel from "@/components/Carousel";
import { Anime } from "../lib/anilist";
import { useState, useLayoutEffect } from "react";
import { useCardCount } from "@/components/useCardCount";

interface CarouselSectionProps {
  animeList: Anime[];
  title?: string;
  likedAnimeIds: number[];
}

export default function CarouselSection({
  animeList,
  title,
  likedAnimeIds,
}: CarouselSectionProps) {
  const cardCount = useCardCount();
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    const update = () => setWindowWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (windowWidth === null || cardCount === null) {
    return <div style={{ height: 420 }} />;
  }

  const isMobile = windowWidth <= 1000;

  const items = animeList.map((anime) => {
    const titleText = anime.title.english || anime.title.romaji;
    const displayTitle =
      titleText.length > 20
        ? titleText.slice(0, isMobile ? 24 : 30) + "..."
        : titleText;

    return (
      <Card
        key={anime.id}
        animeId={anime.id}
        imageSrc={anime.coverImage.large}
        animeTitle={displayTitle}
        liked={likedAnimeIds.includes(anime.id)}
      />
    );
  });

  return (
    <Carousel
      cardFixedWidth={isMobile ? 120 : 200}
      gap={isMobile ? 12 : 16}
      items={items}
      step={cardCount}
      visibleItems={cardCount}
      title={title}
    />
  );
}
