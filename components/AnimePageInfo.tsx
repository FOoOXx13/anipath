"use client";

import { useState } from "react";
import Link from "next/link";
import CommentSection from "./CommentsSection";


const AnimePageInfo = ( {currentAnime}: { currentAnime: any }) => {
  const [activeContent, setActiveContent] = useState("Overview");

  

  const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function getMonthName(month?: number) {
  if (!month) return null;
  return MONTHS[month - 1];
}

  const buttons = [{
    title: "Overview",
  }, {
    title: "Info",
  }, {
    title: "Comments",
  }, {
    title: "Characters",
  }, {
    title: "Staff",
  }, 
    ];

   const renderContent = () => {
    switch (activeContent) {
      case "Overview":
        return  <div>


      <div className="w-full mt-6 md:mt-10">
      {currentAnime.trailer?.site === "youtube" && (
        <>
      <h2 className="text-2xl sm:text-3xl my-4 font-bold">Trailer</h2>
        <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden mb-4">
          <iframe
            src={`https://www.youtube.com/embed/${currentAnime.trailer.id}`}
            className="w-full h-full"
            allowFullScreen
          />
        </div>
        </>
      )}
    </div>

    <div className="mt-6 md:mt-10">
      {currentAnime.relations?.edges?.length > 0 && (
      <h2 className="text-2xl sm:text-3xl font-bold">Relations</h2>
      )}
        <div className="flex gap-4 my-8 flex-wrap">
      {currentAnime.relations?.edges?.map((edge: any) => (
        <Link
          key={edge.node.id}
          href={edge.node.id ? `/anime/${edge.node.id}` : '#'}
          className="flex w-full sm:w-80 h-full bg-(--bg-light) rounded-xl gap-4 p-4 sm:p-0"
        >
        
          {edge.node.coverImage?.large && (
            <div className="w-24 sm:w-30 h-24 sm:h-40 shrink-0">
              <img
                className="w-full h-full rounded-lg sm:rounded-xl shrink-0 object-cover"
                src={edge.node.coverImage.large}
                alt={edge.node.title?.romaji ?? "Relation cover"}
              />

            </div>
          )}
          <div className="flex-1 sm:w-50 h-auto sm:h-40 flex flex-col gap-2">
            <span className="text-xs sm:text-sm mt-2">{edge.relationType}</span>
            <span className="text-sm sm:text-md font-bold line-clamp-2">{edge.node.title?.romaji.length > 40 ? `${edge.node.title?.romaji.substring(0, 40)}...` : edge.node.title?.romaji}</span>
            <div className="mt-auto mb-2 flex gap-2 flex-wrap">
            <span className="text-xs">{edge.node.type}</span>
            <span className="text-xs">{edge.node.status}</span>
            </div>
          </div>
        </Link>
      ))}
        </div>
    </div>



  </div>

      case "Info":
        return <div className="flex flex-col justify-center my-4 w-full">

          <div className="px-2 rounded-2xl">
              {currentAnime.format && (
                <div className="flex flex-col">
                  <span className="text-lg sm:text-xl font-bold">Format</span>
                  <span className="text-(--color-muted) font-semibold text-sm sm:text-base">{currentAnime.format}</span>
                </div>
              )}
          </div>

          <div className="mt-4 px-2 flex flex-col">
              {currentAnime.status && (
                <div>
                  <span className="text-lg sm:text-xl font-bold">Status</span>
                  <span className="text-(--color-muted) font-semibold text-sm sm:text-base block">{currentAnime.status}</span>
                </div>
              )}
          </div>

          <div className="mt-4 px-2 flex flex-col">
              {currentAnime.season && (
                <div>
                  <span className="text-lg sm:text-xl font-bold">Season</span>
                  <span className="text-(--color-muted) font-semibold text-sm sm:text-base block">{currentAnime.season} {currentAnime.seasonYear}</span>
                </div>
              )}
          </div>

          <div className="mt-4 px-2 flex flex-col">
              {currentAnime.startDate && (
                <div>
                  <span className="text-lg sm:text-xl font-bold">Start Date</span>
                  <span className="text-(--color-muted) font-semibold text-sm sm:text-base block"> {getMonthName(currentAnime.startDate.month)} {currentAnime.startDate?.day} {currentAnime.startDate?.year}</span>
                </div>
              )}
          </div>

          <div className="mt-4 px-2 flex flex-col">
              {currentAnime.endDate && (
                <div>
                  <span className="text-lg sm:text-xl font-bold">End date</span>
                  <span className="text-(--color-muted) font-semibold text-sm sm:text-base block">{getMonthName(currentAnime.endDate.month)}  {currentAnime.endDate?.day} {currentAnime.endDate?.year}</span>
                </div>
              )}
          </div>

          <div className="mt-4 px-2 flex flex-col">
              {currentAnime.popularity && (
                <div>
                  <span className="text-lg sm:text-xl font-bold">Popularity</span>
                  <span className="text-(--color-muted) font-semibold text-sm sm:text-base block">{currentAnime.popularity}</span>
                </div>
              )}
          </div>

          <div className="mt-4 px-2 flex flex-col">
              {currentAnime.studios?.nodes && currentAnime.studios.nodes.length > 0 && (
              <div>
                <span className="text-lg sm:text-xl font-bold">Studios</span>
                <div className="text-(--color-muted) font-semibold flex flex-col text-sm sm:text-base">
                  {currentAnime.studios.nodes.map((studio: any) => (
                    <span key={studio.id}>{studio.name}</span>
                  ))}
                </div>
              </div>
              )}  
          </div>

          <div className="mt-4 px-2 flex flex-col">
            {currentAnime.producers?.nodes && currentAnime.producers.nodes.length > 0 && (
              <div>
                <span className="text-lg sm:text-xl font-bold">Producers</span>
                <div className="text-(--color-muted) font-semibold flex flex-col text-sm sm:text-base">
                  {currentAnime.producers.nodes.map((producer: any) => (
                    <span key={producer.id}>{producer.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 px-2 flex flex-col">
              {currentAnime.source && (
                <div>
                  <span className="text-lg sm:text-xl font-bold">Source</span>
                  <span className="text-(--color-muted) font-semibold text-sm sm:text-base block">{currentAnime.source}</span>
                </div>
              )}
          </div>

          <div className="mt-4 px-2 flex flex-col">
              {currentAnime.hashtag && (
                <div>
                  <span className="text-lg sm:text-xl font-bold">Hashtag</span>
                  <span className="text-(--color-muted) font-semibold text-sm sm:text-base block break-all">{currentAnime.hashtag}</span>
                </div>
              )}
          </div>

          <div className="mt-4 px-2 flex flex-col">
              {currentAnime.title.romaji && (
                <div>
                  <span className="text-lg sm:text-xl font-bold">Romaji</span>
                  <span className="text-(--color-muted) font-semibold text-sm sm:text-base block wrap-break-word">{currentAnime.title.romaji}</span>
                </div>
              )}
          </div>

          <div className="mt-4 px-2 flex flex-col">
              {currentAnime.title.english && (
                <div>
                  <span className="text-lg sm:text-xl font-bold">English</span>
                  <span className="text-(--color-muted) font-semibold text-sm sm:text-base block wrap-break-word">{currentAnime.title.english}</span>
                </div>
              )}
          </div>

          <div className="mt-4 px-2 flex flex-col">
              {currentAnime.title.native && (
                <div>
                  <span className="text-lg sm:text-xl font-bold">Native</span>
                  <span className="text-(--color-muted) font-semibold text-sm sm:text-base block wrap-break-word">{currentAnime.title.native}</span>
                </div>
              )}
          </div>

          <div className="mt-4 px-2 flex flex-col">
              {currentAnime.synonyms && currentAnime.synonyms.length > 0 && (
                <div>
                  <span className="text-lg sm:text-xl font-bold">Synonyms</span>
                  <div className="text-(--color-muted) font-semibold flex flex-col text-sm sm:text-base">
                    {currentAnime.synonyms.map((synonym: any) => (
                      <span key={synonym} className="wrap-break-word">{synonym}</span>
                    ))}
                  </div>
                </div>
              )}
          </div>

        </div>;

      case "Comments":
        return <div>
      <CommentSection animeId={currentAnime.id}/>
          
        </div>;

      case "Characters":
        return <div>Characters content here...</div>;

      case "Staff":
        return <div>Staff content here...</div>;

      case "Stats":
        return <div>Stats content here...</div>;

      default:
        return <div>Overview content here...</div>;
    }
  };

  return (
    <div className="">

        <div className="w-full flex items-center gap-2 sm:gap-4 lg:gap-8 overflow-x-auto">
            {
                buttons.map((button) => (
                    <button key={button.title} onClick={() => setActiveContent(button.title)} className={`bg-(--bg-light) px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl text-sm sm:text-base font-medium hover:opacity-90 transition-opacity whitespace-nowrap ${button.title === "Info" ? "md:hidden" : ""}`}>{button.title}</button>
                ))
            }

        </div>

        <div className="mt-4 md:mt-6">
            {renderContent()}
        </div>

    </div>
  )
}

export default AnimePageInfo
