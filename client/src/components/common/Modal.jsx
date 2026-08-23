import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import { useModalA11y } from "../../hooks/useModalA11y";

/**
 * Shared dialog shell (backdrop, focus trap via useModalA11y, close button)
 * used by DonateModal, VolunteerModal and AdminModal. Pass `title` for the
 * admin-style header-row layout (title + close button side by side); omit it
 * for the floating-close-button layout used by the public donate/volunteer
 * forms, which render their own heading inside `children`.
 *
 * Scrolling: the dialog is a flex column whose *content* is the only scroll
 * container. Previously the backdrop and the dialog were both `overflow-y-auto`,
 * so on a short screen (landscape phone) the two nested scrollers fought each
 * other, and the close button - positioned inside the scrolling box - slid out
 * of view as soon as the donor scrolled the form. Keeping the header/close
 * outside the scroll area fixes both.
 *
 * Rendered through a portal to <body> because several callers sit inside
 * animated cards (EventCard within StaggerItem, ProjectCard, ...). Those
 * wrappers keep a `transform` on the element after the entrance animation,
 * and a transformed ancestor becomes the containing block for
 * `position: fixed` - which anchored this backdrop to the *card* instead of
 * the viewport, so the popup rendered part-way down the page and clipped.
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

  return createPortal(
    <div
      className={`fixed inset-0 z-[999] flex justify-center overflow-hidden bg-black/60 p-3 sm:p-4 ${
        align === "start" ? "items-start" : "items-center"
      }`}
    >
      {/* dvh rather than vh so the mobile browser's collapsing address bar
          doesn't leave part of the dialog under the chrome. */}
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={`relative flex max-h-[calc(100dvh-1.5rem)] w-full ${maxWidthClassName} flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100dvh-2rem)] dark:bg-gray-800`}
      >
        {title ? (
          <div className="flex shrink-0 items-start justify-between gap-3 px-6 pb-4 pt-6 sm:px-8 sm:pt-8">
            <h2 id={labelledBy} className="text-xl font-bold text-chadi-green dark:text-chadi-lightgreen">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              aria-label="Close"
            >
              <FaTimes size={18} />
            </button>
          </div>
        ) : (
          // Sits on the dialog (not the scrolling content), so it stays put
          // while the form scrolls underneath it.
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-gray-400 backdrop-blur-sm transition hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800/80 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <FaTimes size={18} />
          </button>
        )}

        {/* overscroll-contain stops the scroll chaining to the page behind. */}
        <div
          className={`overflow-y-auto overscroll-contain px-6 pb-6 sm:px-8 sm:pb-8 ${
            title ? "" : "pt-6 sm:pt-8"
          }`}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;
