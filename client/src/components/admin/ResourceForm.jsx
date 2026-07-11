import { useState } from "react";
import toast from "react-hot-toast";
import { uploadImage } from "../../services/api";
import RichTextEditor from "./RichTextEditor";

/**
 * An image field that uploads immediately on file selection and stores the
 * resulting URL as the field's value. Shows a live preview and lets the
 * admin still paste a URL directly if they'd rather not upload a file.
 */
function ImageField({ field, value, onChange }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(field.name, url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="mt-2 space-y-3">
      {value && (
        <img
          src={value}
          alt=""
          className="h-32 w-full rounded-lg border border-gray-200 object-cover"
        />
      )}

      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-lg border border-chadi-green px-4 py-2 text-sm font-semibold text-chadi-green hover:bg-chadi-green hover:text-white">
          {uploading ? "Uploading..." : value ? "Replace Image" : "Upload Image"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {value && (
          <button
            type="button"
            onClick={() => onChange(field.name, "")}
            className="text-sm font-semibold text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        )}
      </div>

      <input
        type="text"
        placeholder="...or paste an image URL directly"
        value={value}
        onChange={(event) => onChange(field.name, event.target.value)}
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-chadi-green"
      />
    </div>
  );
}

/**
 * Renders a form from a declarative field list and calls onSubmit with the
 * collected values. Used for every content collection (projects, events,
 * team, gallery, partners, stories) so each admin page only needs to
 * describe its fields, not rebuild the form each time.
 */
function ResourceForm({ fields, initialValues = {}, onSubmit, onCancel, submitting }) {
  const [values, setValues] = useState(() => {
    const defaults = {};
    fields.forEach((field) => {
      defaults[field.name] = initialValues[field.name] ?? (field.type === "checkbox" ? false : "");
    });
    return defaults;
  });

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => {
          const wide = field.type === "textarea" || field.type === "image" || field.type === "richtext" || field.fullWidth;

          return (
            <label key={field.name} className={`block ${wide ? "sm:col-span-2" : ""}`}>
              <span className="text-sm font-semibold text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500"> *</span>}
              </span>

              {field.type === "image" ? (
                <ImageField field={field} value={values[field.name]} onChange={handleChange} />
              ) : field.type === "richtext" ? (
                <RichTextEditor
                  value={values[field.name]}
                  onChange={(html) => handleChange(field.name, html)}
                />
              ) : field.type === "textarea" ? (
                <textarea
                  className="mt-2 min-h-28 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
                  required={field.required}
                  value={values[field.name]}
                  onChange={(event) => handleChange(field.name, event.target.value)}
                />
              ) : field.type === "select" ? (
                <select
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
                  required={field.required}
                  value={values[field.name]}
                  onChange={(event) => handleChange(field.name, event.target.value)}
                >
                  <option value="">Select...</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === "checkbox" ? (
                <input
                  type="checkbox"
                  className="mt-2 h-5 w-5 rounded border-gray-300 text-chadi-green focus:ring-chadi-green"
                  checked={!!values[field.name]}
                  onChange={(event) => handleChange(field.name, event.target.checked)}
                />
              ) : (
                <input
                  type={field.type || "text"}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
                  required={field.required}
                  value={values[field.name]}
                  onChange={(event) => handleChange(field.name, event.target.value)}
                />
              )}

              {field.hint && <span className="mt-1 block text-xs text-gray-400">{field.hint}</span>}
            </label>
          );
        })}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-200 px-6 py-2.5 font-semibold text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-chadi-green px-6 py-2.5 font-semibold text-white transition hover:bg-chadi-gold hover:text-black disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

export default ResourceForm;
