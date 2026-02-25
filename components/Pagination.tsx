"use client";

import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
}

export default function Pagination({
  currentPage,
  lastPage,
  hasNextPage,
}: PaginationProps) {
  const pages = [];

  const end = Math.min(lastPage, 5);
  for (let i = 1; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center gap-3 mt-8">
      {currentPage > 1 && (
        <Link
          href={`/anime?page=${currentPage - 1}`}
          prefetch={false}
          className="px-3 py-1 border rounded hover:bg-gray-200 transition"
        >
          Prev
        </Link>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={`/anime?page=${page}`}
          prefetch={false}
          className={`px-3 py-1 border rounded transition ${
            page === currentPage
              ? "bg-black text-white"
              : "hover:bg-gray-200"
          }`}
        >
          {page}
        </Link>
      ))}

      {hasNextPage && (
        <Link
          href={`/anime?page=${currentPage + 1}`}
          prefetch={false}
          className="px-3 py-1 border rounded hover:bg-gray-200 transition"
        >
          Next
        </Link>
      )}
    </div>
  );
}