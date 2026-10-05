import { useTransactionReport } from "../../hooks/reports/useTransactionReport";
import TransactionReport from "../../components/reports/TransactionReport";

export default function PurchasesReport() {
  const report = useTransactionReport("purchases");
  return (
    <TransactionReport
      title="Purchases Report"
      partyLabel="Supplier"
      fileName="purchases-report.csv"
      {...report}
    />
  );
}