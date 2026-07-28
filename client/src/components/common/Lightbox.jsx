import { useEffect } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useModalA11y } from "../../hooks/useModalA11y";

/**
 * Fullscreen viewer for a project's photos and videos. `items` is the full
 * list ({ type, url, caption }); `index` is the open item's position, or
 * null when closed. Arrow keys and on-screen arrows move between items.
 */
function Lightbox({ items, index, onClose, onNavigate }) {
  const open = index !== null && index !== undefined;
  const containerRef = useModalA11y(open, onClose);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") onNavigate(1);
      if (event.key === "ArrowLeft") onNavigate(-1);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onNavigate]);

  if (!open) return null;

  const item = items[index];
  if (!item) return null;

  const hasMultiple = items.length > 1;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 p-4 sm:p-10"
      onClick={onClose}
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={item.caption || "Media viewer"}
        className="relative flex max-h-full max-w-6xl flex-col items-center"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-12 right-0 text-white/80 transition hover:text-white"
        >
          <FaTimes size={26} />
        </button>

        {item.type === "video" ? (
          <video
            src={item.url}
            controls
            autoPlay
            className="max-h-[75vh] max-w-full rounded-lg shadow-2xl"
          />
        ) : (
          <img
            src={item.url}
            alt={item.caption || ""}
            className="max-h-[75vh] max-w-full rounded-lg object-contain shadow-2xl"
          />
        )}

        {item.caption && (
          <p className="mt-4 max-w-2xl text-center text-sm text-white/70">
            {item.caption}
          </p>
        )}

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => onNavigate(-1)}
              aria-label="Previous"
              className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition hover:bg-black/70 sm:-left-4 sm:-translate-x-full"
            >
              <FaChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() => onNavigate(1)}
              aria-label="Next"
              className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition hover:bg-black/70 sm:-right-4 sm:translate-x-full"
            >
              <FaChevronRight size={18} />
            </button>

            <p className="mt-3 text-xs text-white/50">
              {index + 1} / {items.length}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Lightbox;
