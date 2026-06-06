"use client";

import Card from "@/components/Card";
import Carousel from "@/components/Carousel";
import { Media, MediaType } from "../lib/anilist";
import { useState, useLayoutEffect } from "react";
import { useCardCount } from "@/components/useCardCount";

interface CarouselSectionProps {
  mediaList: Media[];
  title?: string;
  likedMediaIds: number[];
  savedMediaIds: number[];
  type: MediaType;
}

export default function CarouselSection({
  mediaList,
  title,
  likedMediaIds,
  savedMediaIds,
  type,
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

  const items = mediaList.map((media) => {
   const displayTitle = media.title.english || media.title.romaji;

    return (
      <Card
        key={media.id}
        mediaId={media.id}
        imageSrc={media.coverImage.large}
        mediaTitle={displayTitle}
        liked={likedMediaIds.includes(media.id)}
        saved={savedMediaIds.includes(media.id)}
        genres={media.genres}
        type={type}
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
