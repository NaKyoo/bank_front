import { useState } from 'react';

const DepositForm = () => {

    const [amount, setAmount] = useState('');  // ce que l'utilisateur tape dans le champ (montant à déposer) // 
    const [error, setError] = useState(''); // message d'erreur si montnant invalide // 
    const [success, setSuccess] = useState(''); // message de confitrmation si dépôt réussi //

    const handleSubmit = (e) => {
        e.preventDefault(); // empêche le rechargement de la page //
        const numAmount = parseFloat(amount); // analyse la chanie de carac et renvoie un flottant // 

        // vérifie si l'utilisateur à entré un montant valide //
        if (isNaN(numAmount) || numAmount <= 0) {
            setError('Veuillez entrer un montant valide supérieur à zéro.');
            setSuccess('');
            return;
        }

        // Simule un appel API pour effectuer le dépôt //
        Deposit(numAmount)
            .then(() => {
                setSuccess(`Dépôt de ${numAmount.toFixed(2)} € effectué avec succès.`);
                setError('');
                setAmount('');
            })
            .catch(() => {
                setError("Une erreur s'est produite lors du dépôt. Veuillez réessayer.");
                setSuccess('');
            });
        };

        // Affichage html // 
        return (
        <div className ="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className ="text-2xl font-bold mb-4 text-center">Faire un dépôt</h2>
            <form onSubmit={handleSubmit} className ="flex flex-col gap-4">
                <input
                    type="number"
                    step="0.01"
                    placeholder="Montant en €"
                    value={amount} // champ relié à l'état React //
                    onChange={(e) => setAmount(e.target.value)} // met à jour l'état à chaque modification du champ //
                    className ="p-3 border border-gray-300 rounded-md"
                />
                <button type="submit">Dépsoer</button>
            </form>
        </div>
        );

        // rendering conditionnele des messages d'erreur et de succès //
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
};

// rend disponible le comosant pour l'utiliser ailleur dans le code // 
export default DepositPage;
