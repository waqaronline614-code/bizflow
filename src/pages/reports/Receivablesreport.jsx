import BalanceReport from "../../components/reports/Balancereports";


const config = {
  invoiceCollection: "orders",
  invoicePartyId: ["customerId", "customer"],      
  dateField: ["orderDate", "date", "createdAt"],
  totalField: ["grandTotal", "totalAmount", "total"],
  partyCollection: "customers",
  partyNameFields: ["fullName", "customerName", "name"],
  paymentCollection: "payments",                  
  paymentType: "received",
};

export default function ReceivablesReport() {
  return (
    <BalanceReport
      config={config}
      title="Customer balances"
      partyLabel="Customer"
      totalLabel="Total receivable"
    />
  );
}