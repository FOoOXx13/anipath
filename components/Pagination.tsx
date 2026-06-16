"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface PaginationProps {
  page: number;
  basePath: string;
  pageInfo: {
    currentPage: number;
    lastPage: number;
    hasNextPage: boolean;
  };
}

// Helper to generate visible page numbers
function getPageNumbers(current: number, total: number, delta = 2) {
  const pages: number[] = [];

  const start = Math.max(1, current - delta);
  const end = Math.min(total, current + delta);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}

export default function Pagination({
  page,
  basePath,
  pageInfo,
}: PaginationProps) {
  const searchParams = useSearchParams();

  // Fix AniList phantom last page
  const total =
    !pageInfo.hasNextPage && pageInfo.lastPage > page
      ? page
      : pageInfo.lastPage;

  const pages = getPageNumbers(page, total);

  // 🔥 Build URL while preserving filters
  const createPageUrl = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", String(newPage));
    }

    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">

      {/* PREV */}
      {page > 1 && (
        <Link
          href={createPageUrl(page - 1)}
          className="w-10 h-10 bg-bg-dark rounded-full flex items-center justify-center hover:bg-[var(--color-accent)] transition"
        >
          {"<"}
        </Link>
      )}

      {/* FIRST PAGE + ... */}
      {pages[0] > 1 && (
        <>
          <Link
            href={createPageUrl(1)}
            className="w-10 h-10 bg-bg-dark rounded-full flex items-center justify-center"
          >
            1
          </Link>

          {pages[0] > 2 && (
            <span className="w-10 h-10 flex items-center justify-center">
              ...
            </span>
          )}
        </>
      )}

      {/* MAIN PAGES */}
      {pages.map((p) => (
        <Link
          key={p}
          href={createPageUrl(p)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
            p === page
              ? "bg-[var(--color-accent)] text-black"
              : "bg-bg-dark hover:bg-[var(--color-accent)]"
          }`}
        >
          {p}
        </Link>
      ))}

      {/* LAST PAGE + ... */}
      {pages[pages.length - 1] < total && (
        <>
          {pages[pages.length - 1] < total - 1 && (
            <span className="w-10 h-10 flex items-center justify-center">
              ...
            </span>
          )}

          <Link
            href={createPageUrl(total)}
            className="w-10 h-10 bg-bg-dark rounded-full flex items-center justify-center"
          >
            {total}
          </Link>
        </>
      )}

      {/* NEXT */}
      {pageInfo.hasNextPage && (
        <Link
          href={createPageUrl(page + 1)}
          className="w-10 h-10 bg-bg-dark rounded-full flex items-center justify-center hover:bg-[var(--color-accent)] transition"
        >
          {">"}
        </Link>
      )}
    </div>
  );
}