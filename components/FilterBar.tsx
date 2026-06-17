"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const GENRES = ["Action", "Drama", "Comedy", "Romance", "Fantasy"];
const SEASONS = ["WINTER", "SPRING", "SUMMER", "FALL"];
const YEARS = Array.from({ length: 25 }, (_, i) => String(2025 - i));

const FORMATS = [
  "TV",
  "TV_SHORT",
  "MOVIE",
  "SPECIAL",
  "OVA",
  "ONA",
];

const STATUS = [
  "FINISHED",
  "RELEASING",
  "NOT_YET_RELEASED",
  "CANCELLED",
];

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
    const SINGLE_SELECT = ["season", "year", "format", "status"];

   if (SINGLE_SELECT.includes(key)) {
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

    router.push(`?${newParams.toString()}`);
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
          {params.get("season") ? `Season: ${params.get("season")}` : "Season"}
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

      <div className="relative">
  <button
    onClick={() => setOpen(open === "year" ? null : "year")}
    className={`px-3 py-1 rounded ${
      hasFilter("year")
        ? "bg-[var(--color-accent)] text-black"
        : "bg-[var(--bg-dark)] hover:bg-[var(--color-accent)]"
    }`}
  >
    {params.get("year") ? `Year: ${params.get("year")}` : "Year"}
  </button>

  {open === "year" && (
    <div className="absolute max-h-60 overflow-y-auto bg-[var(--bg-dark)] p-3 rounded mt-2 z-50 shadow-lg">
      {YEARS.map((y) => (
        <button
          key={y}
          onClick={(e) => {
            e.stopPropagation();
            toggleValue("year", y);
            setOpen(null);
          }}
          className={`block w-full text-left px-2 py-1 ${
            isSelected("year", y)
              ? "text-[var(--color-accent)]"
              : "hover:text-[var(--color-accent)]"
          }`}
        >
          {y}
        </button>
      ))}
    </div>
  )}
</div>

<div className="relative">
  <button
    onClick={() => setOpen(open === "format" ? null : "format")}
    className={`px-3 py-1 rounded ${
      hasFilter("format")
        ? "bg-[var(--color-accent)] text-black"
        : "bg-[var(--bg-dark)] hover:bg-[var(--color-accent)]"
    }`}
  >
    {params.get("format") ? `Format: ${params.get("format")}` : "Format"}
  </button>

  {open === "format" && (
    <div className="absolute bg-[var(--bg-dark)] p-3 rounded mt-2 z-50 shadow-lg">
      {FORMATS.map((f) => (
        <button
          key={f}
          onClick={(e) => {
            e.stopPropagation();
            toggleValue("format", f);
            setOpen(null);
          }}
          className={`block w-full text-left px-2 py-1 ${
            isSelected("format", f)
              ? "text-[var(--color-accent)]"
              : "hover:text-[var(--color-accent)]"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  )}
</div>

<div className="relative">
  <button
    onClick={() => setOpen(open === "status" ? null : "status")}
    className={`px-3 py-1 rounded ${
      hasFilter("status")
        ? "bg-[var(--color-accent)] text-black"
        : "bg-[var(--bg-dark)] hover:bg-[var(--color-accent)]"
    }`}
  >
    {params.get("status")
  ? `Status: ${params.get("status")?.replaceAll("_", " ")}`
  : "Status"}
  </button>

  {open === "status" && (
    <div className="absolute bg-[var(--bg-dark)] p-3 rounded mt-2 z-50 shadow-lg">
      {STATUS.map((s) => (
        <button
          key={s}
          onClick={(e) => {
            e.stopPropagation();
            toggleValue("status", s);
            setOpen(null);
          }}
          className={`block w-full text-left px-2 py-1 ${
            isSelected("status", s)
              ? "text-[var(--color-accent)]"
              : "hover:text-[var(--color-accent)]"
          }`}
        >
          {s.replaceAll("_", " ")}
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