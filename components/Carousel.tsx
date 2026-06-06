"use client";

import { useRef, useState, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";

interface CarouselProps {
  items: React.ReactNode[];
  visibleItems?: number;
  step?: number;
  gap?: number;
  cardFixedWidth?: number;
  skeleton?: boolean;
  title?: string;
}

export default function GsapCarousel({
  items,
  visibleItems = 10,
  step = 1,
  gap = 16,
  cardFixedWidth = 200,
  skeleton = false,
  title = "",
}: CarouselProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const [index, setIndex] = useState(0);

  const cardWidth = cardFixedWidth;
  const totalCards = items.length;
  const visibleCount = visibleItems;

  const maxIndex = Math.max(totalCards - visibleCount, 0);

  const handleNext = () => setIndex((prev) => Math.min(prev + step, maxIndex));
  const handlePrev = () => setIndex((prev) => Math.max(prev - step, 0));

  // Keep index valid if items or visible count changes
  useEffect(() => {
    setIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  // Animate scrolling using GSAP
  useLayoutEffect(() => {
    if (!trackRef.current || !wrapperRef.current) return;

    const fullWidth =
      totalCards * cardWidth + Math.max(totalCards - 1, 0) * gap;

    const viewportWidth = wrapperRef.current.offsetWidth;

    const maxTranslate = Math.max(fullWidth - viewportWidth, 0);

    const target = Math.min(index * (cardWidth + gap), maxTranslate);

    gsap.to(trackRef.current, {
      x: -target,
      duration: 0.5,
      ease: "power2.out",
    });
  }, [index, totalCards, cardWidth, gap]);

  // Set wrapper width & update on resize
  useLayoutEffect(() => {
    if (!wrapperRef.current) return;

    const setWidth = () => {
      const width =
        visibleCount * cardWidth + Math.max(visibleCount - 1, 0) * gap;

      wrapperRef.current!.style.width = `${width}px`;
    };

    setWidth();
    window.addEventListener("resize", setWidth);
    return () => window.removeEventListener("resize", setWidth);
  }, [visibleCount, cardWidth, gap]);

  return (
    <div className="w-full flex flex-col items-center md:flex-row md:justify-center gap-4">
      {/* Desktop Prev */}
      <button
        onClick={handlePrev}
        className="hidden md:flex p-2 hover:opacity-60 bg-bg-light rounded-full"
      >
        <Image src="/icons/arrow-left_dark.png" alt="Prev" width={24} height={24} />
      </button>

      {/* Viewport */}
      <div ref={wrapperRef} className="overflow-hidden">
             <h2 className="text-2xl min-[1001px]:text-4xl mb-1 lg:mb-2  font-bold ">
                 { title}
                </h2>
        <div
          ref={trackRef}
          className={`flex${skeleton ? " skeleton-track" : ""}`}
          style={{ gap }}
        >
          {items.map((item, i) => (
            <div key={i} className="shrink-0" style={{ width: cardWidth }}>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Next */}
      <button
        onClick={handleNext}
        className="hidden md:flex p-2 hover:opacity-60 bg-bg-light rounded-full"
      >
        <Image src="/icons/arrow-right_dark.png" alt="Next" width={24} height={24} />
      </button>

      {/* Mobile Controls */}
      <div className="md:hidden  flex gap-4">
        <button
          onClick={handlePrev}
          className="p-2 hover:opacity-60 bg-bg-light rounded-full"
        >
          <Image src="/icons/arrow-left_dark.png" alt="Prev" width={24} height={24} />
        </button>

        <button
          onClick={handleNext}
          className="p-2 hover:opacity-60 bg-bg-light rounded-full"
        >
          <Image src="/icons/arrow-right_dark.png" alt="Next" width={24} height={24} />
        </button>
      </div>
    </div>
  );
}
