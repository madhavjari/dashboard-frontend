import { fmtINR } from "../../../utils/format";

export default function TaxBreakdown({ gstRows, context }) {
  return (
    <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">
        Tax Head Breakdown
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
              <th className="py-2">Tax Head</th>
              <th className="py-2 text-right">On {context}</th>
              <th className="py-2 text-right">On Returns</th>
              <th className="py-2 text-right">Net</th>
            </tr>
          </thead>
          <tbody>
            {gstRows.map((r) => (
              <tr key={r.label} className="border-b border-gray-100">
                <td className="py-2 font-medium text-gray-900">{r.label}</td>
                <td className="py-2 text-right text-gray-700">
                  {fmtINR(r.context, 2)}
                </td>
                <td className="py-2 text-right text-gray-700">
                  {fmtINR(r.returns, 2)}
                </td>
                <td className="py-2 text-right text-gray-700">
                  {fmtINR(r.context - r.returns, 2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
