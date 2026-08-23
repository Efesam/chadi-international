import Modal from "./Modal";
import DonateForm from "./DonateForm";

/**
 * The popup donate flow - general (non-project) donations only. A donor
 * supporting a specific project instead gets a full page (see
 * pages/public/ProjectDonate.jsx) rather than this modal, since a payment
 * form crammed into a popup read as unprofessional and behaved awkwardly on
 * some screens once real donors started using it for project giving.
 */
function DonateModal({ open, onClose, initialAmount }) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="donate-form-title">
      <DonateForm initialAmount={initialAmount} onDone={onClose} />
    </Modal>
  );
}

export default DonateModal;
