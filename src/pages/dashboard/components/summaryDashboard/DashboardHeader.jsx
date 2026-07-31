export default function DashboardHeader({ title1, title2, title3 }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">{title3}</h1>
      <p className="mt-1 text-sm text-gray-500">
        {title1} Invoices · {title2} Returns
      </p>
    </div>
  );
}
