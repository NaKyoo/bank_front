import { useParams, useNavigate} from 'react-router-dom';  // permet de récupérer les information depuis l'url | permet de rediriger l'utilisateur vers une autre page //
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TransactionDetail() {
    const { userAccountNumber  , transactionId} = useParams();
    const navigate = useNavigate();
    const [ transaction, setTransaction ] = useState(null);
    const [ error, setError ] = useState(null);
    


    useEffect(() => {
        // permet de chercher le token stocker dans le navigateur du client reçu au moment de la connexion de l'utilisateur //
        // il est stocker dans le localStorage sous la clé "access_token"
        const token = localStorage.getItem("access_token");
        // permet d'avoir accès au détail depuis le backend sécurisé en envoyant le jeton d'authentification (JWT) dans les headers //
        // appel http get pour récupérer les données côté serveur // 
        axios.get(
            `http://localhost:8000/transactions/${userAccountNumber}/${transactionId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        // récupération des données et gestion d'erreur et affichage dynamique selon l'état de chargement //
        .then(res => setTransaction(res.data))
        .catch(err => {
            if (err.response) { // Axios donne accès à la réponse d’erreur du serveur (statut + message) // 
                setError(err.response.data.detail); // detail de l'erreur envoyer par le backend pour nous préciser ce qui n'a pas marcher //
            }else{
                setError("Erreur Inconnue");
            }
        });
    }, [transactionId, userAccountNumber]);

    // affichage dynamique selon l'état de chargement  // 
    if (error) return <div className='error'>{error}</div>
    if(!transaction) return <div>Chargement...</div>
    return (
    <div
        className="max-w-md mx-auto mt-12 px-6 py-8 rounded-lg shadow-lg"
        style={{ backgroundColor: 'var(--surface)', color: 'var(--text)' }}
    >
        <h2 className="text-2xl font-semibold mb-6 text-center text-[var(--primary-light)]">
        Détails de la transaction
        </h2>

        <div className="space-y-2 text-sm">
        <p>
            <strong>Montant :</strong> {transaction.amount} €
        </p>
        <p>
            <strong>Date :</strong> {new Date(transaction.date).toLocaleString()}
        </p>
        <p>
            <strong>Type :</strong> {transaction.transaction_type}
        </p>
        <p>
            <strong>Compte source :</strong> {transaction.source_account_number || "N/A"}
        </p>
        <p>
            <strong>Compte destinataire :</strong> {transaction.destination_account_number || "N/A"}
        </p>
        <p>
            <strong>Statut :</strong> {transaction.status}
        </p>
        </div>

        <button
        onClick={() => navigate("/profile")}
        className="mt-6 w-full py-2 rounded-md bg-[var(--primary)] text-[var(--text-inverse)] font-medium transition hover:bg-[var(--primary-dark)]"
        >
        Retour au profil
        </button>
    </div>
    );
}