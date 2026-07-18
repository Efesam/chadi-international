import { useState } from "react";
import toast from "react-hot-toast";
import { FaTrash, FaPlus, FaUpload } from "react-icons/fa";
import { uploadImage } from "../../services/api";

function MediaUploadButton({ value, onChange }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
      toast.success("Uploaded");
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="File URL"
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-chadi-green"
      />
      <label className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-chadi-green px-3 py-2 text-xs font-semibold text-chadi-green hover:bg-chadi-green hover:text-white">
        <FaUpload size={11} />
        {uploading ? "..." : "Upload"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  );
}

/**
 * A repeatable list of structured rows - each row's shape is described by
 * field.itemFields. Used for anything that's "an unlimited list of things"
 * on a resource: a project's media gallery, its spending log, etc.
 */
function RepeaterField({ field, value, onChange }) {
  const items = value || [];

  const updateItem = (index, itemName, itemValue) => {
    const next = items.map((item, i) => (i === index ? { ...item, [itemName]: itemValue } : item));
    onChange(field.name, next);
  };

  const addItem = () => {
    const blank = {};
    field.itemFields.forEach((f) => {
      blank[f.name] = f.type === "number" ? "" : "";
    });
    onChange(field.name, [...items, blank]);
  };

  const removeItem = (index) => {
    onChange(field.name, items.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-2 space-y-3">
      {items.map((item, index) => (
        <div key={index} className="rounded-lg border border-gray-200 p-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {field.itemFields.map((itemField) => (
              <div key={itemField.name} className={itemField.type === "media" ? "sm:col-span-2" : ""}>
                <span className="text-xs font-semibold text-gray-500">{itemField.label}</span>
                {itemField.type === "media" ? (
                  <div className="mt-1">
                    <MediaUploadButton
                      value={item[itemField.name]}
                      onChange={(val) => updateItem(index, itemField.name, val)}
                    />
                  </div>
                ) : itemField.type === "select" ? (
                  <select
                    value={item[itemField.name] || ""}
                    onChange={(event) => updateItem(index, itemField.name, event.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-chadi-green"
                  >
                    {itemField.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={itemField.type || "text"}
                    value={item[itemField.name] || ""}
                    onChange={(event) => updateItem(index, itemField.name, event.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-chadi-green"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Live preview for media rows */}
          {item.type === "video" && item.url ? (
            <video src={item.url} controls className="mt-3 h-32 rounded-lg" />
          ) : item.url ? (
            <img src={item.url} alt="" className="mt-3 h-24 rounded-lg object-cover" />
          ) : null}

          <button
            type="button"
            onClick={() => removeItem(index)}
            className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700"
          >
            <FaTrash size={11} /> Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 rounded-lg border border-dashed border-chadi-green px-4 py-2 text-sm font-semibold text-chadi-green hover:bg-chadi-green/5"
      >
        <FaPlus size={12} /> Add {field.itemLabel || "Item"}
      </button>
    </div>
  );
}

export default RepeaterField;
