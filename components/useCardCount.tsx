"use client";

import { useState, useEffect } from "react";

export function useCardCount() {
  const getCount = () => {
    if (typeof window === "undefined") return 8;
    const w = window.innerWidth;

    if (w >= 2050) return 8;
    if (w >= 1850) return 7;
    if (w >= 1550) return 6;
    if (w >= 1250) return 5;
    if (w >= 1150) return 4;
    if (w >= 900) return 3;
    return 2;
  };

  const [cardCount, setCardCount] = useState<number>(getCount);

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
