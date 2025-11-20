import { jsPDF } from "jspdf";
import { useAllTransactions } from "../hooks/useAllTransactions";

const DownloadPdf = () => {
  const { transactions, loading, error } = useAllTransactions();

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
        className="
            px-4 py-2 rounded-md font-semibold
            flex items-center justify-center
            transition-all duration-300
            hover:scale-105 hover:brightness-110 hover:shadow-md
        "
        style={{
            backgroundColor: "var(--primary)",
            color: "var(--text-inverse)",
            cursor: "pointer",
        }}
    >
        <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
        </svg>
    </button>
  );
};

export default DownloadPdf;
