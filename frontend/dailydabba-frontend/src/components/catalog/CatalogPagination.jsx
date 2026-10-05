import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CatalogPagination({ currentPage, totalPages, totalElements, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  // Generate page numbers (1-based for human display)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible);

    if (end - start < maxVisible) {
      start = Math.max(0, end - maxVisible);
    }

    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row"
      aria-label="Pagination"
    >
      <p className="text-xs font-semibold text-ink-soft">
        Page {currentPage + 1} of {totalPages}
        {totalElements != null && ` (${totalElements} total)`}
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          aria-label="Previous page"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-ink shadow-neu-sm transition-all hover:shadow-neu active:shadow-neu-pressed disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>

        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={isActive ? "page" : undefined}
              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-xl px-2 text-xs font-bold transition-all ${
                isActive
                  ? "bg-lime-400 text-ink shadow-neu-inset font-extrabold"
                  : "bg-surface text-ink shadow-neu-sm hover:shadow-neu active:shadow-neu-pressed"
              }`}
            >
              {p + 1}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          aria-label="Next page"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-ink shadow-neu-sm transition-all hover:shadow-neu active:shadow-neu-pressed disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
