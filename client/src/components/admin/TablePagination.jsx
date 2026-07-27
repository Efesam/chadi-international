import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function TablePagination({ page, totalPages, totalCount, pageSize, onPageChange }) {
  if (totalCount === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-6 py-4 text-sm text-gray-500">
      <p>
        Showing <span className="font-semibold text-gray-700">{start}-{end}</span> of{" "}
        <span className="font-semibold text-gray-700">{totalCount}</span>
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-chadi-green hover:text-chadi-green disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaChevronLeft size={12} />
          </button>
          <span className="font-semibold text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-chadi-green hover:text-chadi-green disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaChevronRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

export default TablePagination;
