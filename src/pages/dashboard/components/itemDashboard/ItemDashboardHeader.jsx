export default function ItemDashboardHeader({ context, totalItems, totalQuantity }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Item {context} Register
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        {totalItems} SKUs · {totalQuantity} units moved
      </p>
    </div>
  );
}
