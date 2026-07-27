import Skeleton from "./Skeleton";

// Matches the breakpoints the real content grids use (md:grid-cols-N
// lg:grid-cols-N) so the skeleton doesn't reflow into a different column
// count the instant real data replaces it.
const GRID_CLASSES = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

/**
 * A grid of card-shaped skeletons, standing in for a list of photo cards
 * (projects, team, gallery, events, stories, partners) while it loads.
 */
function CardGridSkeleton({ count = 6, columns = 3 }) {
  return (
    <div className={`grid gap-8 ${GRID_CLASSES[columns] || GRID_CLASSES[3]}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <Skeleton className="h-48 w-full rounded-none" />
          <div className="space-y-3 p-6">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default CardGridSkeleton;
