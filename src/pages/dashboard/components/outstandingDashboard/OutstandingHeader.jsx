export default function OutstandingHeader({ context }) {
  const description =
    context === "Sales"
      ? "Invoice collections and pending receivables"
      : "Supplier payments and pending payables";

  return (
    <header className="mb-7">
      <p className="text-sm font-semibold text-teal-700">Money due</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
        {context === "Sales" ? "Receivables" : "Payables"}
      </h1>
      <p className="mt-1.5 text-sm text-slate-600">
        {description}
      </p>
    </header>
  );
}
