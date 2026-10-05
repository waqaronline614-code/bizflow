import BalanceReport from "../../components/reports/Balancereports";

const config = {
  invoiceCollection: "purchases",
  invoicePartyId: "supplierId",
  dateField: "purchaseDate",
  getTotal: (p) => (Number(p.amountPaid) || 0) + (Number(p.balance) || 0),
  partyCollection: "supplier",
  partyNameFields: ["supplierName", "name"],
  paymentCollection: "payments",
  paymentType: "made",
};

export default function PayablesReport() {
  return (
    <BalanceReport
      config={config}
      title="Supplier balances"
      partyLabel="Supplier"
      totalLabel="Total payable"
    />
  );
}