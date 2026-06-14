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

function getPageNumbers(current: number, total: number, delta = 2) {
  const pages: number[] = [];

  const start = Math.max(1, current - delta);
  const end = Math.min(total, current + delta);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}

export default function Pagination({ page, basePath, pageInfo }: PaginationProps) {
  // AniList can occasionally report an extra trailing page that has no items.
  // If there is no next page, never render pages beyond the current one.
  const total = !pageInfo.hasNextPage && pageInfo.lastPage > page
    ? page
    : pageInfo.lastPage;
  const pages = getPageNumbers(page, total);

  return (
    <div className="flex items-center gap-2">

      {page > 1 && (
        <Link href={`${basePath}?page=${page - 1}`} className="w-10 h-10 bg-bg-dark rounded-full flex items-center justify-center">{"<"}</Link>
      )}

      {pages[0] > 1 && (
        <>
          <Link href={`${basePath}?page=1`} className="w-10 h-10 bg-bg-dark rounded-full flex items-center justify-center">1</Link>
          {pages[0] > 2 && <span className="w-10 h-10 bg-bg-dark rounded-full flex items-center justify-center">...</span>}
        </>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={`${basePath}?page=${p}`}
          className={p === page ? "w-10 h-10 bg-(--color-accent) rounded-full flex items-center justify-center" : "w-10 h-10 bg-bg-dark rounded-full flex items-center justify-center"}
        >
          {p}
        </Link>
      ))}
      {pages[pages.length - 1] < total && (
        <>
          {pages[pages.length - 1] < total - 1 && <span className="w-10 h-10 bg-bg-dark rounded-full flex items-center justify-center">...</span>}
          <Link href={`${basePath}?page=${total}`} className="w-10 h-10 bg-bg-dark rounded-full flex items-center justify-center">{total}</Link>
        </>
      )}

      {pageInfo.hasNextPage && (
        <Link href={`${basePath}?page=${page + 1}`} className="w-10 h-10 bg-bg-dark rounded-full flex items-center justify-center">{">"}</Link>
      )}
    </div>
  );
}