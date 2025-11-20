import { jsPDF } from "jspdf";
import { useTransactions } from "../hooks/useTransactions";

const DownloadPdf = ({ accountNumber }) => {
  const { transactions, loading, error } = useTransactions(accountNumber);

  const generatePDF = () => {
    if (!transactions || transactions.length === 0) return;

    const doc = new jsPDF();

    doc.setFontSize(16);
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = "Relevé des transactions du mois";
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, 15);

    doc.setFontSize(10);

    const startY = 35;
    let y = startY;
    const colX = {
      date: 10,
      type: 50,
      amount: 70,
      source: 100,
      destination: 150,
    };

    doc.setFont(undefined, "bold");
    doc.text("Date", colX.date, y);
    doc.text("Type", colX.type, y);
    doc.text("Montant", colX.amount, y);
    doc.text("Source", colX.source, y);
    doc.text("Destination", colX.destination, y);
    doc.setFont(undefined, "normal");

    y += 7;

    transactions.forEach((t) => {
      const type =
        t.transaction_type === "deposit"
          ? "Crédit"
          : t.transaction_type === "transfer"
          ? "Débit"
          : t.transaction_type;

      doc.text(new Date(t.date).toLocaleString(), colX.date, y);
      doc.text(type, colX.type, y);
      doc.text(`${Number(t.amount).toFixed(2)}€`, colX.amount, y);
      doc.text(t.source_account_number || "—", colX.source, y);
      doc.text(t.destination_account_number || "—", colX.destination, y);

      y += 7;

    });

    doc.save("releve-transactions.pdf");
  };

  if (loading || error) return null;

  return (
    <button
      onClick={generatePDF}
      style={{
        backgroundColor: "var(--primary)",
        padding: "8px 14px",
        color: "white",
        borderRadius: "6px",
        cursor: "pointer",
        marginBottom: "10px",
      }}
    >
      Télécharger le relevé
    </button>
  );
};

export default DownloadPdf;
