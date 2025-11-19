
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
        <div className="max-w-md mx-auto mt-12 px-6 py-8 rounded-lg shadow-lg"
         style={{ backgroundColor: 'var(--surface)', color: 'var(--text)' }}>

            <h2 className="text-2xl font-semibold mb-6 text-center text-[var(--primary-light)]">Faire un dépôt</h2>

            <form onSubmit={handleSubmit} className ="flex flex-col gap-4">

                <input 
                    type="texte"
                    placeholder="Numéro de compte"
                    value={accountNumber} // champ relié à l'état React //
                    onChange={(e) => setAccountNumber(e.target.value)} // met à jour l'état à chaque modification du champ //
                    className ="p-3 rounded-md border border-[var(--border)] bg-[var(--surface-light)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
                <input
                    type="number"
                    step="0.01"
                    placeholder="Montant en €"
                    value={amount} // champ relié à l'état React //
                    onChange={(e) => setAmount(e.target.value)} // met à jour l'état à chaque modification du champ //
                    className ="p-3 rounded-md border border-[var(--border)] bg-[var(--surface-light)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
                <button 
                    type="submit"
                    className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-[var(--text-inverse)] font-medium py-2 rounded-md transition"
                >Déposer</button>
            </form>
        
            {// rendering conditionnele des messages d'erreur et de succès //
            error && <p className="mt-4 text-[var(--error)] text-sm text-center">{error}</p>}
            {success && <p className="mt-4 text-[var(--success)] text-sm text-center">{success}</p>}
        </div>

        );

  
};

// rend disponible le comosant pour l'utiliser ailleur dans le code // 
export default DepositPage;
