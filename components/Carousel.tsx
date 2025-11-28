"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";

interface CarouselProps {
  items: React.ReactNode[];
  visibleItems?: number;
  step?: number;
  gap?: number;
  cardFixedWidth?: number;
  skeleton?: boolean;
}

export default function GsapCarousel({ items, step = 1, gap = 16, visibleItems = 10, cardFixedWidth = 200, skeleton = false }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const visibleCount = visibleItems; // number of cards visible at once

  // fixed card width (do not recalc on resize)
  const fixedWidth = cardFixedWidth;

  const maxIndex = Math.max(items.length - visibleCount, 0);

  const handleNext = () => setIndex((prev) => Math.min(prev + step, maxIndex));
  const handlePrev = () => setIndex((prev) => Math.max(prev - step, 0));

  // Animate track, but clamp the translation to the track width so last card isn't clipped.
  useEffect(() => {
    if (!trackRef.current) return;

    const trackWidth = items.length * fixedWidth + Math.max(items.length - 1, 0) * gap;
    const wrapperWidth = wrapperRef.current
      ? wrapperRef.current.offsetWidth
      : visibleCount * fixedWidth + Math.max(visibleCount - 1, 0) * gap;
    const maxTranslate = Math.max(trackWidth - wrapperWidth, 0);
    const desired = Math.min(index * (fixedWidth + gap), maxTranslate);

    gsap.to(trackRef.current, {
      x: -desired,
      duration: 0.5,
      ease: "power2.out",
    });
  }, [index, fixedWidth, gap, visibleCount, items.length]);

  // clamp index if visible count or items length changes so we don't scroll past end
  useEffect(() => {
    const newMax = Math.max(items.length - visibleCount, 0);
    setIndex((prev) => Math.min(prev, newMax));
  }, [visibleCount, items.length]);

  // Set wrapper width on the client after mount to avoid server/client markup mismatch.
  useEffect(() => {
    setMounted(true);
    if (!wrapperRef.current) return;

    const updateWrapper = () => {
      const width = visibleCount * fixedWidth + Math.max(visibleCount - 1, 0) * gap;
      wrapperRef.current!.style.width = `${width}px`;
    };

    updateWrapper();
    window.addEventListener("resize", updateWrapper);
    return () => window.removeEventListener("resize", updateWrapper);
  }, [visibleCount, fixedWidth, gap]);

  return (
    <div className="w-full flex flex-col items-center md:items-stretch md:flex-row md:justify-center gap-4">
      {/* Desktop: left button, track, right button */}
      <div className="hidden md:flex items-center">
        <button onClick={handlePrev} className="p-2 hover:opacity-60 bg-(--bg-light) rounded-full">
          <Image src="/icons/arrow-left_dark.png" alt="arrow-left" width={24} height={24} />
        </button>
      </div>

      <div ref={wrapperRef} className="overflow-hidden">
        <div
          ref={trackRef}
          className={"flex" + (skeleton ? " skeleton-track" : "")}
          style={{ gap: `${gap}px` }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="shrink-0"
              style={mounted ? { width: fixedWidth } : undefined}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="hidden md:flex items-center">
        <button onClick={handleNext} className="p-2 hover:opacity-60 bg-(--bg-light) rounded-full">
          <Image src="/icons/arrow-right_dark.png" alt="arrow-right" width={24} height={24} />
        </button>
      </div>

      {/* Mobile: buttons centered below the track */}
      <div className="md:hidden mt-1 flex justify-center items-center gap-4 w-full">
        <button onClick={handlePrev} className="p-2 hover:opacity-60 bg-(--bg-light) rounded-full">
          <Image src="/icons/arrow-left_dark.png" alt="arrow-left" width={24} height={24} />
        </button>
        <button onClick={handleNext} className="p-2 hover:opacity-60 bg-(--bg-light) rounded-full">
          <Image src="/icons/arrow-right_dark.png" alt="arrow-right" width={24} height={24} />
        </button>
      </div>
    </div>
  );
}
