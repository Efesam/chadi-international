import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminModal from "./AdminModal";
import ResourceForm from "./ResourceForm";

/**
 * A full list + create/edit/delete admin page for one CMS collection.
 * Every "Manage*" page (Projects, Events, Team, Gallery, Partners, Stories)
 * is a thin wrapper around this, configured with its own columns/fields.
 */
function ResourceManager({ title, description, api, columns, fields, emptyMessage }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.list();
      setItems(data);
    } catch (err) {
      setError(err.message || "Could not load data");
    } finally {
      setLoading(false);
    }
  }, [api]);

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

  const openCreate = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editingItem) {
        await api.update(editingItem.id, values);
        toast.success("Updated successfully");
      } else {
        await api.create(values);
        toast.success("Created successfully");
      }
      closeModal();
      await load();
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    const label = item.title || item.name || "this item";
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;

    try {
      await api.remove(item.id);
      toast.success("Deleted");
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      toast.error(err.message || "Could not delete");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-chadi-green">{title}</h1>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-chadi-green px-5 py-2.5 font-semibold text-white transition hover:bg-chadi-gold hover:text-black"
        >
          <FaPlus size={14} /> Add New
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
        {loading ? (
          <p className="p-8 text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="p-8 text-center font-semibold text-red-600">{error}</p>
        ) : items.length === 0 ? (
          <p className="p-8 text-center text-gray-500">
            {emptyMessage || "Nothing here yet. Click Add New to create the first entry."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-chadi-cream text-chadi-green">
                <tr>
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
                  <tr key={item.id} className="hover:bg-gray-50">
                    {columns.map((col) => (
                      <td key={col.key} className="max-w-xs truncate px-6 py-4 text-gray-700">
                        {col.render ? col.render(item) : item[col.key]}
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="text-chadi-green hover:text-chadi-gold"
                          aria-label="Edit"
                        >
                          <FaEdit size={16} />
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

      {modalOpen && (
        <AdminModal title={editingItem ? `Edit ${title}` : `Add ${title}`} onClose={closeModal}>
          <ResourceForm
            fields={fields}
            initialValues={editingItem || {}}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            submitting={submitting}
          />
        </AdminModal>
      )}
    </div>
  );
}

export default ResourceManager;
