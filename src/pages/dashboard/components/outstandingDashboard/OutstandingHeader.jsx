export default function OutstandingHeader({ context }) {
  const description =
    context === "Sales"
      ? "Invoice collections and pending receivables"
      : "Supplier payments and pending payables";

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {context} Outstanding Report
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}
