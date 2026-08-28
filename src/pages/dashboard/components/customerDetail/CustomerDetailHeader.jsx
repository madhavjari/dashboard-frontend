export default function CustomerDetailHeader({ party, context }) {
  const partyType = context === "Sales" ? "Customer" : "Supplier";
  return (
    <header className="mb-6">
      <p className="text-sm font-semibold text-teal-700">{partyType} ledger</p>
      <h1 className="mt-1 break-words text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{party}</h1>
      <p className="mt-1.5 text-sm text-slate-600">Invoices, returns, outstanding balance, and item activity.</p>
    </header>
  );
}
