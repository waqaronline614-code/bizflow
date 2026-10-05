
import { useTransactionReport } from "../../hooks/reports/useTransactionReport";
import TransactionReport from "../../components/reports/TransactionReport";

export default function SalesReport() {
  const report = useTransactionReport("sales");
  return (
    <TransactionReport
      title="Sales Report"
      partyLabel="Customer"
      fileName="sales-report.csv"
      {...report}
    />
  );
}