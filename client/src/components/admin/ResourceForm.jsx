import { useState } from "react";

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
          const wide = field.type === "textarea" || field.fullWidth;

          return (
            <label key={field.name} className={`block ${wide ? "sm:col-span-2" : ""}`}>
              <span className="text-sm font-semibold text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500"> *</span>}
              </span>

              {field.type === "textarea" ? (
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
