import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash, FaEye } from "react-icons/fa";
import AdminModal from "./AdminModal";

/**
 * A read-mostly admin view for entries the public submits through a form
 * (contact messages, volunteer applications, donation interest). No
 * create/edit - just view detail, mark read, and delete.
 */
function SubmissionManager({ title, description, api, columns, emptyMessage }) {
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

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-chadi-green">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
        {loading ? (
          <p className="p-8 text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="p-8 text-center font-semibold text-red-600">{error}</p>
        ) : items.length === 0 ? (
          <p className="p-8 text-center text-gray-500">{emptyMessage || "No entries yet."}</p>
        ) : (
          <div className="overflow-x-auto">
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
                {items.map((item) => (
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
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => openView(item)}
                          className="text-chadi-green hover:text-chadi-gold"
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewing && (
        <AdminModal title="Submission Detail" onClose={() => setViewing(null)}>
          <dl className="space-y-4">
            {Object.entries(viewing)
              .filter(([key]) => !["id", "read"].includes(key))
              .map(([key, value]) => (
                <div key={key}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {key}
                  </dt>
                  <dd className="mt-1 whitespace-pre-wrap text-gray-700">{String(value)}</dd>
                </div>
              ))}
          </dl>
        </AdminModal>
      )}
    </div>
  );
}

export default SubmissionManager;
