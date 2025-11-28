"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import CardSkeleton from "@/components/CardSkeleton";
import Carousel from "@/components/Carousel";
import {Anime, fetchTrendingAnime, fetchUpcomingAnime, fetchAllTimePopularAnime } from "../app/lib/anilist";
import { useCardCount } from "./useCardCount";


export default function TrendingSection() {
  const cardCount = useCardCount()

  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1024);

  // Track screen size to handle desktop/mobile logic
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize(); // check on mount
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);

  }, []);

  const [animeList, setAnimeList] = useState<Anime[] | null>(null);

  useEffect(() => {
    fetchTrendingAnime(1).then((data) => setAnimeList(data));
  }, []);

  

  const items = animeList
    ? animeList.map((anime) => {
        const title = anime.title.english || anime.title.romaji;
        const shortTitle = title.length > 20 ? title.slice(0, 30) + "..." : title;
        const shorterTitle = title.length > 15 ? title.slice(0, 24) + "..." : title;

        
        return (
          <Card
            key={anime.id}
            imageSrc={anime.coverImage.large}
            animeTitle={windowWidth <= 745  ? shorterTitle : shortTitle}
            animeYear={anime.seasonYear}
            animeEpisodes={anime.episodes}
            cardHeight={windowWidth <= 745 ? 280 : 400}
            imageHeight={windowWidth <= 745 ? 180 : 300}
          />
        );
      })
    : Array.from({ length: 10 }).map((_, i) => <CardSkeleton key={i} />);

  return <Carousel cardFixedWidth={windowWidth <= 745 ? 120 : 200} items={items} step={cardCount} gap={16} visibleItems={cardCount} skeleton={!animeList} />;
}

export  function UpcomingNextSeasonSection() {
   const cardCount = useCardCount()

  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1024);

  // Track screen size to handle desktop/mobile logic
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize(); // check on mount
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);

  }, []);

  const [animeList, setAnimeList] = useState<Anime[] | null>(null);

  useEffect(() => {
    fetchUpcomingAnime(1).then((data) => setAnimeList(data));
  }, []);

  

  const items = animeList
    ? animeList.map((anime) => {
        const title = anime.title.english || anime.title.romaji;
        const shortTitle = title.length > 20 ? title.slice(0, 30) + "..." : title;
        const shorterTitle = title.length > 15 ? title.slice(0, 24) + "..." : title;

        
        return (
          <Card
            key={anime.id}
            imageSrc={anime.coverImage.large}
            animeTitle={windowWidth <= 745  ? shorterTitle : shortTitle}
            animeYear={anime.seasonYear}
            animeEpisodes={anime.episodes}
            cardHeight={windowWidth <= 745 ? 280 : 400}
            imageHeight={windowWidth <= 745 ? 180 : 300}
          />
        );
      })
    : Array.from({ length: 10 }).map((_, i) => <CardSkeleton key={i} />);

  return <Carousel cardFixedWidth={windowWidth <= 745 ? 120 : 200} items={items} step={cardCount} gap={16} visibleItems={cardCount} skeleton={!animeList} />;
}

export  function AllTimePopularSection() {
  const cardCount = useCardCount()

  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1024);

  // Track screen size to handle desktop/mobile logic
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize(); // check on mount
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);

  }, []);

  const [animeList, setAnimeList] = useState<Anime[] | null>(null);

  useEffect(() => {
    fetchAllTimePopularAnime(1).then((data) => setAnimeList(data));
  }, []);

  

  const items = animeList
    ? animeList.map((anime) => {
        const title = anime.title.english || anime.title.romaji;
        const shortTitle = title.length > 20 ? title.slice(0, 30) + "..." : title;
        const shorterTitle = title.length > 15 ? title.slice(0, 24) + "..." : title;

        
        return (
          <Card
            key={anime.id}
            imageSrc={anime.coverImage.large}
            animeTitle={windowWidth <= 745  ? shorterTitle : shortTitle}
            animeYear={anime.seasonYear}
            animeEpisodes={anime.episodes}
            cardHeight={windowWidth <= 745 ? 280 : 400}
            imageHeight={windowWidth <= 745 ? 180 : 300}
          />
        );
      })
    : Array.from({ length: 10 }).map((_, i) => <CardSkeleton key={i} />);

  return <Carousel cardFixedWidth={windowWidth <= 745 ? 120 : 200} items={items} step={cardCount} gap={16} visibleItems={cardCount} skeleton={!animeList} />;
}


