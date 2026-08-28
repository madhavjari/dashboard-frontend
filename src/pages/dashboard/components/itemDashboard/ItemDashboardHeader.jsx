export default function ItemDashboardHeader({ context, totalItems, totalQuantity }) {
  return (
    <header className="mb-7">
      <p className="text-sm font-semibold text-teal-700">{context}</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
        Item performance
      </h1>
      <p className="mt-1.5 text-sm text-slate-600">
        {totalItems} SKUs · {totalQuantity} units moved
      </p>
    </header>
  );
}
