import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash, FaEye, FaSearch } from "react-icons/fa";
import AdminModal from "./AdminModal";
import AdminCardList from "./AdminCardList";
import TablePagination from "./TablePagination";
import TableSkeleton from "./TableSkeleton";
import { usePaginatedSearch } from "../../hooks/usePaginatedSearch";

/**
 * A read-mostly admin view for entries the public submits through a form
 * (contact messages, volunteer applications, donation interest). No
 * create/edit - just view detail, mark read, and delete.
 */
function SubmissionManager({ title, description, api, columns, emptyMessage, renderDetailFooter }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewing, setViewing] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api.list();
        if (!cancelled) setItems(data);
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [api]);

  const openView = async (item) => {
    setViewing(item);
    if (!item.read) {
      try {
        await api.patch(item.id, { read: true });
        setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, read: true } : i)));
      } catch {
        // Non-critical if this fails silently - still shows the entry.
      }
    }
  };

  const updateItem = (id, patch) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
    setViewing((prev) => (prev?.id === id ? { ...prev, ...patch } : prev));
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Delete this entry? This cannot be undone.")) return;

    try {
      await api.remove(item.id);
      toast.success("Deleted");
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      if (viewing?.id === item.id) setViewing(null);
    } catch (err) {
      toast.error(err.message || "Could not delete");
    }
  };

  const renderRowActions = (item) => (
    <>
      <button
        type="button"
        onClick={() => openView(item)}
        className="text-chadi-green hover:text-chadi-gold-dark"
        aria-label="View"
      >
        <FaEye size={16} />
      </button>
      <button
        type="button"
        onClick={() => handleDelete(item)}
        className="text-red-500 hover:text-red-700"
        aria-label="Delete"
      >
        <FaTrash size={16} />
      </button>
    </>
  );

  const searchKeys = useMemo(() => columns.map((col) => col.key), [columns]);
  const { search, setSearch, page, setPage, pageItems, totalPages, totalCount, pageSize } =
    usePaginatedSearch(items, searchKeys);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-chadi-green">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>

      {!loading && !error && items.length > 0 && (
        <div className="relative mt-6 max-w-sm">
          <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-chadi-green"
          />
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
        {loading ? (
          <TableSkeleton columns={columns.length + 2} />
        ) : error ? (
          <p className="p-8 text-center font-semibold text-red-600">{error}</p>
        ) : items.length === 0 ? (
          <p className="p-8 text-center text-gray-500">{emptyMessage || "No entries yet."}</p>
        ) : totalCount === 0 ? (
          <p className="p-8 text-center text-gray-500">No results match "{search}".</p>
        ) : (
          <>
            <AdminCardList
              items={pageItems}
              columns={columns}
              unreadKey="read"
              renderActions={renderRowActions}
            />

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-chadi-cream text-chadi-green">
                  <tr>
                    <th className="px-6 py-4 font-semibold"></th>
                    {columns.map((col) => (
                      <th key={col.key} className="px-6 py-4 font-semibold">
                        {col.label}
                      </th>
                    ))}
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pageItems.map((item) => (
                    <tr key={item.id} className={item.read ? "" : "bg-chadi-lightgreen/10 font-semibold"}>
                      <td className="px-6 py-4">
                        {!item.read && (
                          <span className="inline-block h-2 w-2 rounded-full bg-chadi-gold" title="Unread" />
                        )}
                      </td>
                      {columns.map((col) => (
                        <td key={col.key} className="max-w-xs truncate px-6 py-4 text-gray-700">
                          {col.render ? col.render(item) : item[col.key]}
                        </td>
                      ))}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-3">{renderRowActions(item)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <TablePagination
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {viewing && (
        <AdminModal title="Submission Detail" onClose={() => setViewing(null)}>
          <dl className="space-y-4">
            {Object.entries(viewing)
              .filter(([key, value]) => !["id", "read", "emailToken"].includes(key) && value != null && value !== "")
              .map(([key, value]) => (
                <div key={key}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {key}
                  </dt>
                  <dd className="mt-1 whitespace-pre-wrap text-gray-700">{String(value)}</dd>
                </div>
              ))}
          </dl>
          {renderDetailFooter && (
            <div className="mt-6 border-t border-gray-100 pt-6">
              {renderDetailFooter(viewing, (patch) => updateItem(viewing.id, patch))}
            </div>
          )}
        </AdminModal>
      )}
    </div>
  );
}

export default SubmissionManager;
