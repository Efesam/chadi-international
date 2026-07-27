/**
 * Mobile stand-in for the admin data table. A `<table>` with many columns
 * either overflows off-screen with no visible scroll hint, or forces
 * horizontal scrolling to reach the Edit/Delete actions - neither is
 * discoverable on a phone. Below the `md` breakpoint, this renders each row
 * as a stacked label/value card instead, with actions always visible at the
 * bottom. Shown alongside the table (hidden on the size it isn't needed).
 */
function AdminCardList({ items, columns, unreadKey, renderActions }) {
  return (
    <div className="divide-y divide-gray-100 md:hidden">
      {items.map((item) => (
        <div key={item.id} className={`p-4 ${unreadKey && !item[unreadKey] ? "bg-chadi-lightgreen/10" : ""}`}>
          <dl className="space-y-1.5">
            {columns.map((col) => (
              <div key={col.key} className="flex items-start justify-between gap-4 text-sm">
                <dt className="shrink-0 font-semibold text-gray-500">{col.label}</dt>
                <dd className="truncate text-right text-gray-700">
                  {col.render ? col.render(item) : item[col.key]}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-3 flex justify-end gap-5 border-t border-gray-100 pt-3">{renderActions(item)}</div>
        </div>
      ))}
    </div>
  );
}

export default AdminCardList;
