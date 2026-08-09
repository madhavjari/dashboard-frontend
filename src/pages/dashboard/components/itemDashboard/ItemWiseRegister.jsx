import { ArrowUpDown } from "lucide-react";
import { Link, useLocation } from "react-router";

export default function ItemWiseRegister({
  columns,
  context,
  sortedItems,
  sortKey,
  handleSort,
  summary,
  fmtNumber,
  fmtINR,
}) {
  const { pathname } = useLocation();
  const routePrefix = pathname.startsWith("/demo/") ? "/demo" : "";
  const detailRoute = context === "Sales" ? "item" : "purchase-item";

  return (
    <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200/70">
      <div className="border-b border-slate-100 px-5 py-4">
        <h3 className="font-display text-sm font-bold text-slate-900">
          Item-wise Register
        </h3>
        <p className="text-xs text-slate-500">Click a column to sort</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-500">
              {columns.map(([key, label]) => (
                <th
                  key={key}
                  className="cursor-pointer select-none px-5 py-3 hover:text-slate-800"
                  onClick={() => handleSort(key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {label}
                    <ArrowUpDown
                      size={11}
                      className={sortKey === key ? "opacity-100" : "opacity-30"}
                    />
                  </span>
                </th>
              ))}
              <th className="px-5 py-3 text-right">% of {context}</th>
              <th className="px-5 py-3 text-right">Net Rate(inc. GST)</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => (
              <tr
                key={item.name}
                className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
              >
                <td className="px-5 py-3 font-medium text-slate-900">
                  <Link to={`${routePrefix}/${detailRoute}?item=${item.name}`} target="_blank">
                    {item.name}
                  </Link>
                </td>
                <td className="px-5 py-3 font-mono-num text-slate-700">
                  {item.category}
                </td>
                <td className="px-5 py-3 font-mono-num text-slate-700">
                  {fmtNumber(item.quantity, 1)}
                </td>
                <td className="px-5 py-3 font-mono-num font-medium text-slate-900">
                  {fmtINR(item.transaction)}
                </td>
                <td className="px-5 py-3 text-right font-mono-num text-slate-600">
                  {((item.transaction / summary.totalTransaction) * 100).toFixed(1)}%
                </td>
                <td className="px-5 py-3 text-right font-mono-num text-slate-600">
                  {item.quantity > 0
                    ? `₹${(item.transaction / item.quantity).toFixed(2)}`
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200 font-medium">
              <td className="px-5 py-3 text-slate-900" colSpan={3}>
                Total
              </td>
              <td className="px-5 py-3 font-mono-num text-slate-900">
                {fmtINR(summary.totalTransaction)}
              </td>
              <td className="px-5 py-3 text-right font-mono-num text-slate-900">
                100%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
