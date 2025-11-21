import PropTypes from "prop-types";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: "rgba(15, 15, 15, 0.6)",
        backdropFilter: "blur(4px)",
        padding: "1.5rem",
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        className="bg-surface p-6 rounded-xl shadow-xl max-w-2xl w-full flex flex-col gap-4"
        style={{
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow)",
          backgroundColor: "var(--surface)",
          width: "min(640px, 100%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
