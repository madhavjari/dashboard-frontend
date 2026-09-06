import { useEffect, useRef } from "react";

export const REGISTER_PAGE_SIZE = 20;

export default function RegisterPagination({
  page,
  totalPages,
  startIndex,
  visibleCount,
  totalCount,
  itemLabel,
  onChange,
  scrollTargetId,
}) {
  const pageInputRef = useRef(null);
  const previousPageRef = useRef(page);

  useEffect(() => {
    if (previousPageRef.current === page) return;
    previousPageRef.current = page;

    const frame = window.requestAnimationFrame(() => {
      const target = scrollTargetId
        ? document.getElementById(scrollTargetId)
        : null;
      const visibleTarget = target?.getClientRects().length
        ? target
        : target?.closest("section");
      const firstItem = visibleTarget?.getClientRects().length
        ? visibleTarget.firstElementChild
        : null;

      if (!firstItem) return;

      const targetTop =
        firstItem.getBoundingClientRect().top + window.scrollY - 200;
      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [page, scrollTargetId]);

  function changePage(nextPage) {
    onChange(nextPage);
  }

  function jumpToPage(event) {
    event.preventDefault();
    const requestedPage = Number.parseInt(pageInputRef.current?.value, 10);

    if (!Number.isFinite(requestedPage)) {
      if (pageInputRef.current) pageInputRef.current.value = String(page);
      return;
    }

    changePage(Math.min(totalPages, Math.max(1, requestedPage)));
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
      <p className="text-xs text-slate-500">
        Showing {startIndex + 1}-{startIndex + visibleCount} of {totalCount}{" "}
        {itemLabel}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => changePage(page - 1)}
          className="min-h-10 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <form onSubmit={jumpToPage} className="flex items-center gap-1.5">
          <label
            htmlFor={`${scrollTargetId || itemLabel}-page`}
            className="sr-only"
          >
            Jump to page
          </label>
          <input
            id={`${scrollTargetId || itemLabel}-page`}
            key={page}
            ref={pageInputRef}
            type="number"
            min="1"
            max={totalPages}
            inputMode="numeric"
            defaultValue={page}
            className="h-10 w-14 rounded-lg border border-slate-200 px-2 text-center text-xs font-semibold text-slate-700 outline-none focus:border-teal-600 focus:ring-3 focus:ring-teal-100"
            aria-label={`Current page, from 1 to ${totalPages}`}
          />
          <span className="text-xs text-slate-500">of {totalPages}</span>
          <button
            type="submit"
            className="min-h-10 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Go
          </button>
        </form>
        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => changePage(page + 1)}
          className="min-h-10 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
