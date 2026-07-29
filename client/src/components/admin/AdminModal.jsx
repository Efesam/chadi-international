import Modal from "../common/Modal";

function AdminModal({ title, onClose, children }) {
  return (
    <Modal
      open
      onClose={onClose}
      title={title}
      labelledBy="admin-modal-title"
      maxWidthClassName="max-w-2xl"
      align="start"
    >
      {children}
    </Modal>
  );
}

export default AdminModal;
