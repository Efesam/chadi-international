import { FaTimes } from "react-icons/fa";
import { useModalA11y } from "../../hooks/useModalA11y";

/**
 * Shared dialog shell (backdrop, focus trap via useModalA11y, close button)
 * used by DonateModal, VolunteerModal and AdminModal. Pass `title` for the
 * admin-style header-row layout (title + close button side by side); omit it
 * for the floating-close-button layout used by the public donate/volunteer
 * forms, which render their own heading inside `children`.
 */
function Modal({
  open,
  onClose,
  labelledBy,
  title,
  maxWidthClassName = "max-w-md",
  align = "center",
  children,
}) {
  // Called unconditionally (hooks can't follow an early return) - it's a
  // no-op internally whenever `open` is false.
  const containerRef = useModalA11y(open, onClose);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[999] flex justify-center overflow-y-auto bg-black/60 p-4 ${
        align === "start" ? "items-start py-10" : "items-center py-10"
      }`}
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={`relative max-h-[85vh] w-full ${maxWidthClassName} overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8`}
      >
        {title ? (
          <div className="mb-6 flex items-center justify-between">
            <h2 id={labelledBy} className="text-xl font-bold text-chadi-green">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700"
              aria-label="Close"
            >
              <FaTimes size={20} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 text-gray-400 hover:text-gray-700"
            aria-label="Close"
          >
            <FaTimes size={18} />
          </button>
        )}

        {children}
      </div>
    </div>
  );
}

export default Modal;
