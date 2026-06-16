"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const GENRES = ["Action", "Drama", "Comedy", "Romance", "Fantasy"];
const SEASONS = ["WINTER", "SPRING", "SUMMER", "FALL"];

export default function FilterBar() {
  const router = useRouter();
  const params = useSearchParams();

  const [open, setOpen] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Helpers
  const isSelected = (key: string, value: string) => {
    const current = params.get(key)?.split(",") || [];
    return current.includes(value);
  };

  const hasFilter = (key: string) => {
    return params.get(key) !== null;
  };

  // Main toggle logic
  const toggleValue = (key: string, value: string) => {
    const newParams = new URLSearchParams(params.toString());

    if (key === "season") {
      // SINGLE SELECT
      if (params.get(key) === value) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    } else {
      // MULTI SELECT
      const current = newParams.get(key)?.split(",") || [];

      let updated;

      if (current.includes(value)) {
        updated = current.filter((v) => v !== value);
      } else {
        updated = [...current, value];
      }

      if (updated.length > 0) {
        newParams.set(key, updated.join(","));
      } else {
        newParams.delete(key);
      }
    }

    newParams.set("page", "1");

    router.push(`/anime?${newParams.toString()}`);
  };

  return (
    <div ref={ref} className="relative z-20 flex gap-2 flex-wrap justify-center">
      
      {/* GENRES */}
      <div className="relative">
        <button
          onClick={() => setOpen(open === "genre" ? null : "genre")}
          className={`px-3 py-1 rounded transition ${
            hasFilter("genre")
              ? "bg-[var(--color-accent)] text-black"
              : "bg-[var(--bg-dark)] hover:bg-[var(--color-accent)]"
          }`}
        >
          Genres
        </button>

        {open === "genre" && (
          <div
            className="absolute min-w-[180px] max-h-60 overflow-y-auto bg-[var(--bg-dark)] p-3 rounded mt-2 z-50 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {GENRES.map((g) => (
              <label
                key={g}
                className="flex gap-2 cursor-pointer hover:text-[var(--color-accent)]"
              >
                <input
                  type="checkbox"
                  checked={isSelected("genre", g)}
                  onChange={() => toggleValue("genre", g)}
                />
                {g}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* SEASON */}
      <div className="relative">
        <button
          onClick={() => setOpen(open === "season" ? null : "season")}
          className={`px-3 py-1 rounded transition ${
            hasFilter("season")
              ? "bg-[var(--color-accent)] text-black"
              : "bg-[var(--bg-dark)] hover:bg-[var(--color-accent)]"
          }`}
        >
          Season
        </button>

        {open === "season" && (
          <div
            className="absolute min-w-[160px] bg-[var(--bg-dark)] p-3 rounded mt-2 z-50 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {SEASONS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  toggleValue("season", s);
                  setOpen(null);
                }}
                className={`block w-full text-left px-2 py-1 rounded ${
                  isSelected("season", s)
                    ? "text-[var(--color-accent)]"
                    : "hover:text-[var(--color-accent)]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CLEAR FILTERS */}
      <button
        onClick={() => router.push("/anime")}
        className="px-3 py-1 rounded bg-red-500/80 hover:bg-red-500 text-white transition"
      >
        Clear
      </button>

    </div>
  );
}