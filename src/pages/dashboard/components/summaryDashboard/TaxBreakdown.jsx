import { fmtINR } from "../../../../utils/format";

export default function TaxBreakdown({ gstRows, context }) {
  return (
    <details className="surface-card mt-6 overflow-hidden group">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-5 py-3 text-sm font-semibold text-slate-700 marker:content-none hover:bg-slate-50 sm:px-6">
        <span>GST detail</span>
        <span className="text-xs font-medium text-slate-500 group-open:hidden">CGST, SGST and IGST</span>
        <span className="hidden text-xs font-medium text-teal-700 group-open:inline">Hide detail</span>
      </summary>
      <div className="overflow-x-auto border-t border-slate-200 px-5 pb-4 sm:px-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-[11px] uppercase tracking-wide text-slate-500">
              <th className="py-3">Tax head</th>
              <th className="py-3 text-right">On {context.toLowerCase()}</th>
              <th className="py-3 text-right">On returns</th>
              <th className="py-3 text-right">Net tax</th>
            </tr>
          </thead>
          <tbody>
            {gstRows.map((r) => (
              <tr key={r.label} className="border-b border-slate-100 last:border-0">
                <td className="py-3 font-medium text-slate-900">{r.label}</td>
                <td className="py-3 text-right font-mono-num text-slate-700">
                  {fmtINR(r.context, 2)}
                </td>
                <td className="py-3 text-right font-mono-num text-slate-700">
                  {fmtINR(r.returns, 2)}
                </td>
                <td className="py-3 text-right font-mono-num font-semibold text-slate-900">
                  {fmtINR(r.context - r.returns, 2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
