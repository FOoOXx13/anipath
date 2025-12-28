"use client";

import { useState, useEffect } from "react";

export function useCardCount() {
  const getCount = () => {
    if (typeof window === "undefined") return 8;
    const w = window.innerWidth;

    if (w >= 2480) return 10;
    if (w >= 2280) return 9;
    if (w >= 2060) return 8;
    if (w >= 1860) return 7;
    if (w >= 1624) return 6;
    if (w >= 1230) return 5;
    if (w >= 1000) return 4;
    if (w <= 1000 && w >= 915) return 6;
    if (w <= 915 && w >= 800) return 5;
    if (w <= 800 && w >= 600) return 4;
    if (w <= 600 && w >= 400) return 3;
    return 2;
  };

  // Initialize to a deterministic server-safe value so server and initial client render match.
  // The actual count is computed on the client in useEffect and will update after mount.
  const [cardCount, setCardCount] = useState<number>(() => 8);

  useEffect(() => {
    const update = () => {
      const newCount = getCount();
      setCardCount((prev) => (prev !== newCount ? newCount : prev));
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return cardCount;
} 
