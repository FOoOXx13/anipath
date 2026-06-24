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

  const hasAnyFilter =
    hasFilter("genre") ||
    hasFilter("season") ||
    hasFilter("year") ||
    hasFilter("format") ||
    hasFilter("status");

  const formatLabel = (value: string | null) =>
    value ? value.replaceAll("_", " ") : "";

  const genreSummary = () => {
    const selected = params.get("genre")?.split(",").filter(Boolean) ?? [];

    if (selected.length === 0) return "Any";
    if (selected.length === 1) return selected[0];

    return `${selected[0]} +${selected.length - 1}`;
  };

  const singleValue = (key: string) => {
    const value = params.get(key);
    return value ? formatLabel(value) : "Any";
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

  const triggerClass = (key: string) =>
    `group w-[132px] sm:w-[145px] rounded-xl bg-bg-dark px-3 py-2 text-left transition-colors hover:bg-bg-light ${
      hasFilter(key) ? "text-(--color-accent)" : "text-foreground"
    }`;

  const menuClass =
    "absolute left-0 top-[calc(100%+8px)] min-w-[200px] max-h-64 overflow-y-auto rounded-xl bg-bg-dark p-2.5 shadow-[0_12px_28px_rgba(0,0,0,0.35)] z-50";

  const optionClass = (active: boolean) =>
    `block w-full rounded-lg px-2.5 py-1.5 text-left text-xs sm:text-sm transition-colors ${
      active
        ? "bg-bg-light text-(--color-accent)"
        : "text-foreground hover:bg-bg-light"
    }`;

  const labelClass = "text-[10px] uppercase tracking-wide text-(--color-muted)";
  const valueClass = "mt-0.5 line-clamp-1 text-xs sm:text-sm font-semibold";

  return (
    <div
      ref={ref}
      className="relative z-20 flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-[color-mix(in_hsl,var(--bg-dark)_88%,transparent)] p-2 sm:p-2.5"
    >
      
      {/* GENRES */}
      <div className="relative">
        <button
          onClick={() => setOpen(open === "genre" ? null : "genre")}
          className={triggerClass("genre")}
        >
          <p className={labelClass}>Genres</p>
          <p className={valueClass}>{genreSummary()}</p>
        </button>

        {open === "genre" && (
          <div
            className={menuClass}
            onClick={(e) => e.stopPropagation()}
          >
            {GENRES.map((g) => (
              <label
                key={g}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm hover:bg-bg-light"
              >
                <input
                  type="checkbox"
                  checked={isSelected("genre", g)}
                  onChange={() => toggleValue("genre", g)}
                  className="accent-(--color-accent)"
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
          className={triggerClass("season")}
        >
          <p className={labelClass}>Season</p>
          <p className={valueClass}>{singleValue("season")}</p>
        </button>

        {open === "season" && (
          <div
            className={menuClass}
            onClick={(e) => e.stopPropagation()}
          >
            {SEASONS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  toggleValue("season", s);
                  setOpen(null);
                }}
                className={optionClass(isSelected("season", s))}
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
          className={triggerClass("year")}
  >
    <p className={labelClass}>Year</p>
    <p className={valueClass}>{singleValue("year")}</p>
  </button>

  {open === "year" && (
          <div className={menuClass}>
      {YEARS.map((y) => (
        <button
          key={y}
          onClick={(e) => {
            e.stopPropagation();
            toggleValue("year", y);
            setOpen(null);
          }}
                className={optionClass(isSelected("year", y))}
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
    className={triggerClass("format")}
  >
    <p className={labelClass}>Format</p>
    <p className={valueClass}>{singleValue("format")}</p>
  </button>

  {open === "format" && (
    <div className={menuClass}>
      {FORMATS.map((f) => (
        <button
          key={f}
          onClick={(e) => {
            e.stopPropagation();
            toggleValue("format", f);
            setOpen(null);
          }}
          className={optionClass(isSelected("format", f))}
        >
          {f.replaceAll("_", " ")}
        </button>
      ))}
    </div>
  )}
</div>

<div className="relative">
  <button
    onClick={() => setOpen(open === "status" ? null : "status")}
    className={triggerClass("status")}
  >
    <p className={labelClass}>Status</p>
    <p className={valueClass}>{singleValue("status")}</p>
  </button>

  {open === "status" && (
    <div className={menuClass}>
      {STATUS.map((s) => (
        <button
          key={s}
          onClick={(e) => {
            e.stopPropagation();
            toggleValue("status", s);
            setOpen(null);
          }}
          className={optionClass(isSelected("status", s))}
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
        disabled={!hasAnyFilter}
        className="rounded-xl bg-bg-dark px-3.5 py-2 text-xs sm:text-sm font-semibold text-(--color-muted) transition-colors hover:bg-bg-light hover:text-(--color-accent) disabled:cursor-not-allowed disabled:opacity-40"
      >
        Clear filters
      </button>

    </div>
  );
}