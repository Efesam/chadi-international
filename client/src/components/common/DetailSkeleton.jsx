import Skeleton from "./Skeleton";

/**
 * Stands in for a single detail page (project/program/news article) while
 * its content loads - a large image/banner area plus a few text lines.
 */
function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Skeleton className="h-72 w-full md:h-96" />
      <div className="mt-10 space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

export default DetailSkeleton;
