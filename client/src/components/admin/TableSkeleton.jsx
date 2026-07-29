import Skeleton from "../common/Skeleton";

function TableSkeleton({ columns = 4, rows = 6 }) {
  return (
    <div className="divide-y divide-gray-100 p-6">
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="flex items-center gap-6 py-3">
          {Array.from({ length: columns }).map((__, col) => (
            <Skeleton key={col} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default TableSkeleton;
