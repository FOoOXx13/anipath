"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [inputPage, setInputPage] = useState("");
  const [showInput, setShowInput] = useState(false);

  const pages: number[] = [];

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(lastPage, currentPage + 2);

  // Always include page 1
  if (start > 1) {
    pages.push(1);
  }

  // Add pages in range
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Always include last page
  if (end < lastPage) {
    pages.push(lastPage);
  }

  const handleGoToPage = () => {
    const page = parseInt(inputPage);
    if (page >= 1 && page <= lastPage) {
      router.push(`/anime?page=${page}`);
      setInputPage("");
      setShowInput(false);
    }
  };

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

      {end < lastPage && (
        <button
          onClick={() => setShowInput(!showInput)}
          className="px-3 py-1 border rounded hover:bg-gray-200 transition"
        >
          ...
        </button>
      )}

      {hasNextPage && (
        <Link
          href={`/anime?page=${currentPage + 1}`}
          prefetch={false}
          className="px-3 py-1 border rounded hover:bg-gray-200 transition"
        >
          Next
        </Link>
      )}

      {showInput && (
        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            max={lastPage}
            value={inputPage}
            onChange={(e) => setInputPage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleGoToPage()}
            placeholder="Page #"
            className="px-2 py-1 border rounded"
            autoFocus
          />
          <button
            onClick={handleGoToPage}
            className="px-3 py-1 border rounded bg-black text-white hover:bg-gray-800 transition"
          >
            Go
          </button>
        </div>
      )}
    </div>
  );
}