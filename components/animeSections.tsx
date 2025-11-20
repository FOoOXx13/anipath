"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import CardSkeleton from "@/components/CardSkeleton";
import Carousel from "@/components/Carousel";
import {Anime, fetchTrendingAnime, fetchUpcomingAnime, fetchAllTimePopularAnime } from "../app/lib/anilist";


export default function TrendingSection() {
  const [animeList, setAnimeList] = useState<Anime[] | null>(null);

  useEffect(() => {
    fetchTrendingAnime(1).then((data) => setAnimeList(data));
  }, []);

  const items = animeList
    ? animeList.map((anime) => {
        const title = anime.title.english || anime.title.romaji;
        const shortTitle = title.length > 20 ? title.slice(0, 20) + "..." : title;
        

        return (
          <Card
            key={anime.id}
            imageSrc={anime.coverImage.large}
            animeTitle={shortTitle}
            animeYear={anime.seasonYear}
            animeEpisodes={anime.episodes}
          />
        );
      })
    : Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />);

  return <Carousel items={items} step={1} gap={16} visibleItems={8} />;
}

export  function UpcomingNextSeasonSection() {
  const [animeList, setAnimeList] = useState<Anime[] | null>(null);

  useEffect(() => {
    fetchUpcomingAnime(1).then((data) => setAnimeList(data));
  }, []);

  const items = animeList
    ? animeList.map((anime) => {
        const title = anime.title.english || anime.title.romaji;
        const shortTitle = title.length > 20 ? title.slice(0, 20) + "..." : title;
        

        return (
          <Card
            key={anime.id}
            imageSrc={anime.coverImage.large}
            animeTitle={shortTitle}
            animeYear={anime.seasonYear}
            animeEpisodes={anime.episodes}
          />
        );
      })
    : Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />);

  return <Carousel items={items} step={1} gap={16} visibleItems={8} />;
}

export  function AllTimePopularSection() {
  const [animeList, setAnimeList] = useState<Anime[] | null>(null);

  useEffect(() => {
     fetchAllTimePopularAnime(1).then((data) => setAnimeList(data));
  }, []);

  const items = animeList
    ? animeList.map((anime) => {
        const title = anime.title.english || anime.title.romaji;
        const shortTitle = title.length > 20 ? title.slice(0, 20) + "..." : title;
        

        return (
          <Card
            key={anime.id}
            imageSrc={anime.coverImage.large}
            animeTitle={shortTitle}
            animeYear={anime.seasonYear}
            animeEpisodes={anime.episodes}
          />
        );
      })
    : Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />);

  return <Carousel items={items} step={1} gap={16} visibleItems={8} />;
}


