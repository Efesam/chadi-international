import { useState } from "react";
import toast from "react-hot-toast";
import { FaBullhorn } from "react-icons/fa";
import AdminModal from "./AdminModal";
import { sendBroadcast } from "../../services/api";

/**
 * Row action that lets an admin email everyone on the newsletter list about
 * a specific project or news item - "New project launched", "Update to X",
 * etc. `buildEmail(item)` returns the pre-filled draft; the admin can still
 * edit subject/message before sending. Used from ManageProjects/ManageNews.
 */
function NotifyButton({ item, buildEmail }) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [draft, setDraft] = useState(null);

  const openCompose = () => {
    setDraft(buildEmail(item));
    setOpen(true);
  };

  const handleSend = async (event) => {
    event.preventDefault();
    setSending(true);
    try {
      const result = await sendBroadcast(draft);
      if (result.total === 0) {
        toast.success("No newsletter subscribers yet - nothing to send.");
      } else {
        toast.success(
          `Sent to ${result.sent} of ${result.total} subscriber${result.total === 1 ? "" : "s"}${
            result.failed ? ` (${result.failed} failed)` : ""
          }.`
        );
      }
      setOpen(false);
    } catch (err) {
      toast.error(err.message || "Could not send update");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openCompose}
        className="text-chadi-green hover:text-chadi-gold-dark"
        aria-label="Notify subscribers"
        title="Notify newsletter subscribers"
      >
        <FaBullhorn size={16} />
      </button>

      {open && draft && (
        <AdminModal title="Notify Newsletter Subscribers" onClose={() => setOpen(false)}>
          <form onSubmit={handleSend} className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Subject</span>
              <input
                type="text"
                required
                value={draft.subject}
                onChange={(event) => setDraft((prev) => ({ ...prev, subject: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Message</span>
              <textarea
                required
                value={draft.message}
                onChange={(event) => setDraft((prev) => ({ ...prev, message: event.target.value }))}
                className="mt-2 min-h-32 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
              />
            </label>

            <p className="text-xs text-gray-400">
              This emails everyone currently subscribed to the CHADI newsletter, individually addressed - not a
              reply-all. Review the message before sending; it can't be recalled.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-gray-200 px-6 py-2.5 font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending}
                className="rounded-lg bg-chadi-green px-6 py-2.5 font-semibold text-white transition hover:bg-chadi-gold hover:text-black disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send Update"}
              </button>
            </div>
          </form>
        </AdminModal>
      )}
    </>
  );
}

export default NotifyButton;
