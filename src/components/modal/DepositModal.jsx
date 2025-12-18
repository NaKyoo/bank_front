import PropTypes from "prop-types";
import DepositForm from "../DepositForm";

const DepositModal = ({ accountNumber, onClose, refresh }) => {
  return (
    <DepositForm
      accountNumber={accountNumber}
      onSuccess={() => {
        refresh();     // rafraîchit la liste des comptes //
        onClose();     // ferme le modal // 
      }}
    />
  );
};

DepositModal.propTypes = {
  accountNumber: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
};

<<<<<<< HEAD
export default DepositModal;
=======
export default DepositModal;
>>>>>>> 7a462496e68ee03144f6b2489a653c1528d051b4
