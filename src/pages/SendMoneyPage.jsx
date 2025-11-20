import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserAccounts } from "../api/accountService";
import { useTransfer } from "../hooks/useTransfer";
import "../styles/Dashboard.css";

const SendMoneyPage = () => {
  const { user: authUser } = useAuth();
  const token = authUser?.token || authUser?.access_token || null;

  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [form, setForm] = useState({ from: "", to: "", amount: "" });
  const [formError, setFormError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const { send, loading: sending, error: sendError } = useTransfer();

  const fetchAccounts = async () => {
    setLoadingAccounts(true);
    try {
      const data = await getUserAccounts(token);
      setAccounts(data || []);
      // preselect first account
      if (data && data.length > 0 && !form.from) setForm((s) => ({ ...s, from: data[0].account_number || data[0].id }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAccounts(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    setFormError(null);
    const { from, to, amount } = form;
    if (!from) return setFormError("Choisis un compte source");
    if (!to) return setFormError("Renseigne le compte destinataire");
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return setFormError("Le montant doit être supérieur à 0");

    // check balance client-side
    const src = accounts.find((a) => (a.account_number || a.id) === from);
    if (src) {
      const bal = src.balance ?? src.amount ?? 0;
      if (typeof bal === "number" && amt > bal) return setFormError("Solde insuffisant");
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg(null);
    setFormError(null);

    const ok = validate();
    if (ok !== true) return;

    try {
      await send({ from_account: form.from, to_account: form.to, amount: parseFloat(form.amount), token });
      setSuccessMsg("Transfert effectué avec succès");
      setForm((s) => ({ ...s, amount: "" }));
      // refresh accounts to show new balance
      await fetchAccounts();
    } catch (err) {
      // sendError handled by hook; ensure message shown
      setFormError(err.message || "Erreur lors du transfert");
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Envoyer de l'argent</h1>
      </header>

      <section style={{ maxWidth: 720, margin: "0 auto" }}>
        <form onSubmit={handleSubmit} className="auth-card" style={{ padding: 20 }}>
          {loadingAccounts ? (
            <p>Chargement des comptes…</p>
          ) : (
            <>
              <label>Compte source</label>
              <select name="from" value={form.from} onChange={handleChange} className="p-2">
                <option value="">-- Choisir --</option>
                {accounts.map((a) => (
                  <option key={a.account_number || a.id} value={a.account_number || a.id}>
                    {a.account_type || a.type} — {a.account_number || a.id} — {typeof a.balance === 'number' ? a.balance + ' €' : a.balance}
                  </option>
                ))}
              </select>

              <label style={{ marginTop: 12 }}>Compte destinataire (numéro)</label>
              <input name="to" value={form.to} onChange={handleChange} className="p-2" />

              <label style={{ marginTop: 12 }}>Montant</label>
              <input name="amount" value={form.amount} onChange={handleChange} type="number" step="0.01" className="p-2" />

              {formError && <div className="error-message" style={{ marginTop: 12 }}>{formError}</div>}
              {sendError && <div className="error-message" style={{ marginTop: 12 }}>{sendError}</div>}
              {successMsg && <div className="loading-message" style={{ marginTop: 12 }}>{successMsg}</div>}

              <div style={{ marginTop: 16 }}>
                <button type="submit" className="btn btn-primary" disabled={sending}>{sending ? 'Envoi…' : 'Envoyer'}</button>
              </div>
            </>
          )}
        </form>
      </section>
    </div>
  );
};

export default SendMoneyPage;
