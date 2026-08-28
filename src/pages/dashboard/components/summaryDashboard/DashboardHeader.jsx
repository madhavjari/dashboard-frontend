export default function DashboardHeader({ title1, title2, title3 }) {
  const context = title3.toLowerCase().includes("purchase") ? "Purchases" : "Sales";
  return (
    <header className="mb-7">
      <p className="text-sm font-semibold text-teal-700">{context}</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Performance summary</h1>
      <p className="mt-1.5 text-sm text-slate-600">
        {title1} invoices · {title2} returns in the selected financial year
      </p>
    </header>
  );
}
