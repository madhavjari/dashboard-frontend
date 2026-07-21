export default function DashboardHeader({ summary }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Sales Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        {summary.invoiceCount} invoices · {summary.returnCount} returns
      </p>
    </div>
  );
}
