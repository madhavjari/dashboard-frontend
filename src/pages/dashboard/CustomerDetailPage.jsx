import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import StatCard from "../../components/dashboard/StatCard";
import { fmtCompact, fmtINR } from "../../utils/format";

export default function CustomerDetailPage() {
  const [searchParams] = useSearchParams();
  const party = searchParams.get("party");
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!party) return;
    fetch(
      `http://localhost:5000/api/v1/reports/sales/customer?party=${encodeURIComponent(party)}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data.customerData);
        setSummary(data.summary[0]);
        setLoading(false);
      });
  }, [party]);

  function fmtNumber(n, digits = 0) {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: digits,
    }).format(n);
  }
  function getQuantity(t) {
    if (t.per === "W") return t.weight;
    if (t.per === "M") return t.meters;
    return t.pcs;
  }
  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900">{party}</h1>
        <p className="text-sm text-gray-500">Customer Ledger</p>

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <StatCard
            label="Total Sales"
            value={fmtCompact(summary.salesAmount)}
            sub={fmtINR(summary.salesAmount)}
            tone="text-green-600"
          />
          <StatCard
            label="Total Returns"
            value={fmtCompact(summary.returnAmount)}
            sub={fmtINR(summary.returnAmount)}
            tone="text-red-600"
          />
          <StatCard
            label="Net Sales"
            value={fmtCompact(summary.netSales)}
            sub={fmtINR(summary.netSales)}
          />
          <StatCard
            label="Invoices"
            value={summary.invoiceCount}
            sub="total bills"
          />
        </div>

        {/* Transaction Table */}
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200/70">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="font-display text-sm font-bold text-slate-900">
              Transaction Register
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Invoice</th>
                  <th className="px-5 py-3">Item</th>
                  <th className="px-5 py-3 text-right">Qty</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3 text-center">Type</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-50 hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-3">
                      {new Date(t.billDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 font-mono">{t.billNo}</td>
                    <td className="px-5 py-3">{t.itemName}</td>
                    <td className="px-5 py-3 text-right font-mono">
                      {fmtNumber(getQuantity(t), 1)} {t.per}
                    </td>
                    <td className="px-5 py-3 text-right font-mono">
                      {fmtINR(t.totalAmount)}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.code === "SR" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                      >
                        {t.code}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
