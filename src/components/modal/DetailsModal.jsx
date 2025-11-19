import PropTypes from "prop-types";
import { parseDate } from "../../utils/parseDate";

const DetailsModal = ({ account}) => {
  if (!account) return null;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold" style={{ color: "var(--primary)" }}>
        Détails du compte
      </h3>

      <div className="flex flex-col gap-2 text-text">
        <p><strong>Numéro :</strong> {account.account_number}</p>
        <p><strong>Solde :</strong> {Number(account.balance).toFixed(2)} €</p>
        <p><strong>Type :</strong> {account.parent_account_number ? "Secondaire" : "Principal"}</p>
        <p><strong>Ouverture :</strong> {parseDate(account.created_at)}</p>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <button className="p-3 rounded-md bg-primary text-text-inverse font-semibold hover:brightness-110 transition">
          Faire un dépôt
        </button>
        <button className="p-3 rounded-md bg-primary text-text-inverse font-semibold hover:brightness-110 transition">
          Faire un virement
        </button>
        <button className="p-3 rounded-md bg-primary text-text-inverse font-semibold hover:brightness-110 transition">
          Voir l'historique
        </button>
        <button
          href="/dashboard"
          className="p-3 rounded-md bg-error text-text-inverse font-semibold hover:brightness-110 transition"
        >
          Retour
        </button>
      </div>
    </div>
  );
};

DetailsModal.propTypes = {
  account: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default DetailsModal;
