"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";

interface CarouselProps {
  items: React.ReactNode[];
  visibleItems?: number;
  step?: number;
  gap?: number;
}

export default function GsapCarousel({ items, step = 1, gap = 16, visibleItems = 8 }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState<number>(0);
  const defaultCardWidth = 200; // same as skeleton/Card width
  const computedCardWidth = cardWidth || defaultCardWidth;  


  const visibleCount = visibleItems ; // number of cards visible at once

  useEffect(() => {
    if (!wrapperRef.current) return;
    
    const handleResize = () => {
      const containerWidth = wrapperRef.current!.offsetWidth;
      // subtract the total gaps between visible cards so cards fit exactly
      const totalGaps = Math.max(visibleCount - 1, 0) * gap;
      const computed = Math.max((containerWidth - totalGaps) / visibleCount, 0);
      setCardWidth(computed);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(items.length - visibleCount, 0);

  const handleNext = () => setIndex(prev => Math.min(prev + step, maxIndex));
  const handlePrev = () => setIndex(prev => Math.max(prev - step, 0));

  useEffect(() => {
    if (!trackRef.current) return;

    gsap.to(trackRef.current, {
      x: -(index * (cardWidth + gap)),
      duration: 0.5,
      ease: "power2.out"
    });
  }, [index, cardWidth, gap]);


  return (
    <div className="flex items-center gap-4 w-full">
      <button onClick={handlePrev} className="mx-1 p-2  hover:bg-(--bg-light) rounded-full"><Image src='/icons/arrow-left_dark.png' alt="arrow-left" width={24} height={24}/></button>

      <div ref={wrapperRef} className="overflow-hidden w-full">
        <div
          ref={trackRef}
          className="flex"
          style={{ gap: `${gap}px`,}}
        >
          {items.map((item, i) => (
           <div key={i} className="shrink-0" style={{ width: computedCardWidth }}>
            {item}
          </div>
          ))}
        </div>
      </div>

      <button onClick={handleNext} className="mx-1 p-2  hover:bg-(--bg-light) rounded-full"><Image src='/icons/arrow-right_dark.png' alt="arrow-right" width={24} height={24}/></button>
    </div>
  );
}
