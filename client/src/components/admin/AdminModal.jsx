import { FaTimes } from "react-icons/fa";
import { useModalA11y } from "../../hooks/useModalA11y";

function AdminModal({ title, onClose, children }) {
  // This component is only ever mounted while open (the parent conditionally
  // renders it), so "open" is always true from here.
  const containerRef = useModalA11y(true, onClose);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 py-10">
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl sm:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 id="admin-modal-title" className="text-xl font-bold text-chadi-green">
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
        {children}
      </div>
    </div>
  );
}

export default AdminModal;
