export default function CustomerDetailHeader({ party }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{party}</h1>
      <p className="text-sm text-gray-500">Customer Ledger</p>
    </div>
  );
}
