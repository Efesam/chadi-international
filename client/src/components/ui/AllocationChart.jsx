const COLORS = ["#347928", "#FCCD2A", "#C0EBA6", "#8FBF7A", "#E8A33D"];

/**
 * A simple donut chart built with a CSS conic-gradient - no charting
 * library needed for one chart. Expects [{ category, percentage }, ...].
 */
function AllocationChart({ data }) {
  const stops = data.reduce((acc, item, index) => {
    const previousEnd = index === 0 ? 0 : acc.cumulative;
    const end = previousEnd + item.percentage;
    const color = COLORS[index % COLORS.length];
    acc.segments.push(`${color} ${previousEnd}% ${end}%`);
    acc.cumulative = end;
    return acc;
  }, { cumulative: 0, segments: [] }).segments;

  return (
    <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center">
      <div
        className="h-48 w-48 shrink-0 rounded-full"
        style={{ background: `conic-gradient(${stops.join(", ")})` }}
        role="img"
        aria-label="Fund allocation breakdown"
      >
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white text-center text-xs font-semibold text-chadi-green">
            Fund
            <br />
            Allocation
          </div>
        </div>
      </div>

      <ul className="space-y-3">
        {data.map((item, index) => (
          <li key={item.category} className="flex items-center gap-3">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-sm text-gray-700">
              <span className="font-bold text-chadi-green">{item.percentage}%</span>{" "}
              {item.category}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AllocationChart;
