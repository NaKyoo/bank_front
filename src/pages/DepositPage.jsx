import { useState } from 'react';

const DepositPage = () => {

    const [amount, setAmount] = useState('');  // ce que l'utilisateur tape dans le champ (montant à déposer) // 
    const [error, setError] = useState(''); // message d'erreur si montnant invalide // 
    const [success, setSuccess] = useState(''); // message de confitrmation si dépôt réussi //

    const [accountNumber, setAccountNumber] = useState(''); // état pour stocker le numéro de compte //

    const handleSubmit = async (e) => {
        e.preventDefault(); // empêche le rechargement de la page //
        const numAmount = parseFloat(amount); // analyse la chaine de caractère et renvoie un flottant // 

        // vérifie si l'utilisateur à entré un montant valide //
        if (isNaN(numAmount) || numAmount <= 0) {
            setError('Veuillez entrer un montant valide supérieur à zéro.');
            setSuccess('');
            return;
        }

        try {
            // API JS qui génère une chaîn ede paramètre d'URL type : account_number=FR123456&deposit_amount=150.00 // 
            // cette paretie sert à valider les données avant de les envoyer au serveur //
            const params = new URLSearchParams({
                account_number: accountNumber, // num de compte "FR987654321"
                deposit_amount: numAmount.toString(), // montant dépose (ex :200 €) covertit en string car URLSearchParams prend que ça //
            });

            const response = await fetch(`/api/deposit?${params.toString()}`, {
                method: 'POST',
            });

            if(!response.ok) {
                const text = await response.text();
                throw new Error(text);
            };

            const result = await response.json();
            setSuccess(`Dépôt de ${numAmount}€ effectué avec succès.`);
            setError('');
            setAmount('');
            } catch (err) {
                setError(`Erreur lors du dépôt: ${err.message}`);
                setSuccess('');
            }

        
    };

        // affichage html // 
        return (
        <div className ="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className ="text-2xl font-bold mb-4 text-center">Faire un dépôt</h2>
            <form onSubmit={handleSubmit} className ="flex flex-col gap-4">

                <input 
                    type="texte"
                    placeholder="Numéro de compte"
                    value={accountNumber} // champ relié à l'état React //
                    onChange={(e) => setAccountNumber(e.target.value)} // met à jour l'état à chaque modification du champ //
                    className ="p-3 border border-gray-300 rounded-md"
                />
                <input
                    type="number"
                    step="0.01"
                    placeholder="Montant en €"
                    value={amount} // champ relié à l'état React //
                    onChange={(e) => setAmount(e.target.value)} // met à jour l'état à chaque modification du champ //
                    className ="p-3 border border-gray-300 rounded-md"
                />
                <button type="submit">Déposer</button>
            </form>
        
            {// rendering conditionnele des messages d'erreur et de succès //
            error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>

        );

  
};

// rend disponible le comosant pour l'utiliser ailleur dans le code // 
export default DepositPage;
