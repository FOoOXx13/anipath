import Link from "next/link";

interface PaginationProps {
  page: number;
  pageInfo: {
    currentPage: number;
    lastPage: number;
    hasNextPage: boolean;
  };
}

function getPageNumbers(current: number, total: number, delta = 2) {
  const pages: number[] = [];

  const start = Math.max(1, current - delta);
  const end = Math.min(total, current + delta);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}

export default function Pagination({ page, pageInfo }: PaginationProps) {
  const total = pageInfo.lastPage;
  const pages = getPageNumbers(page, total);

  return (
    <div className="flex items-center gap-2">

      {page > 1 && (
        <Link href={`/anime?page=${page - 1}`}>{"<"}</Link>
      )}

      {pages[0] > 1 && (
        <>
          <Link href="/anime?page=1">1</Link>
          {pages[0] > 2 && <span>...</span>}
        </>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={`/anime?page=${p}`}
          className={p === page ? "font-bold underline" : ""}
        >
          {p}
        </Link>
      ))}

      {pages[pages.length - 1] < total && (
        <>
          {pages[pages.length - 1] < total - 1 && <span>...</span>}
          <Link href={`/anime?page=${total}`}>{total}</Link>
        </>
      )}

      {pageInfo.hasNextPage && (
        <Link href={`/anime?page=${page + 1}`}>{">"}</Link>
      )}
    </div>
  );
}