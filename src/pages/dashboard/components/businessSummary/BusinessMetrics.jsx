import { ArrowDownRight, ArrowUpRight, Landmark, WalletCards } from "lucide-react";
import StatCard from "../../../../components/dashboard/StatCard";

export default function BusinessMetrics({ summary, fmtCompact, fmtINR }) {
  const balance = 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Net Sales"
        value={fmtCompact(summary.netSales)}
        sub={fmtINR(summary.netSales)}
        tone="text-emerald-700"
      />
      <StatCard
        label="Sales Outstanding"
        value={fmtCompact(summary.salesOutstanding)}
        sub="Money to collect"
        tone="text-amber-700"
      />
      <StatCard
        label="Purchase Outstanding"
        value={fmtCompact(summary.purchaseOutstanding)}
        sub="Payments to plan"
        tone="text-rose-700"
      />
      <StatCard
        label="Ledger Balance"
        value={fmtCompact(balance)}
        sub="Will be available with ledger data"
        tone="text-slate-700"
      />
    </div>
  );
}

export function MorningFocus({ summary, fmtINR }) {
  const netReceivable = summary.salesOutstanding - summary.purchaseOutstanding;
  const isPositive = netReceivable >= 0;

  return (
    <section className="rounded-2xl bg-slate-950 p-6 text-white shadow-lg shadow-slate-950/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-teal-300">Morning focus</p>
          <h2 className="mt-2 text-xl font-bold">Start with your cash commitments.</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
            You have {fmtINR(summary.salesOutstanding)} to collect and {fmtINR(summary.purchaseOutstanding)} to pay.
          </p>
        </div>
        <span className="rounded-xl bg-white/10 p-3 text-teal-300">
          <WalletCards size={24} />
        </span>
      </div>
      <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5 text-sm">
        {isPositive ? <ArrowUpRight className="text-emerald-400" size={20} /> : <ArrowDownRight className="text-rose-400" size={20} />}
        <span className="text-slate-300">Net receivable position</span>
        <span className="ml-auto font-bold text-white">{fmtINR(Math.abs(netReceivable))}</span>
      </div>
    </section>
  );
}

export function BankBalances({ fmtINR }) {
  const banks = [
    { name: "Primary Bank Account", balance: 0 },
    { name: "Business Bank Account", balance: 0 },
    { name: "Reserve Bank Account", balance: 0 },
  ];

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Landmark size={18} className="text-teal-700" />
        <div>
          <h2 className="font-bold text-slate-900">Bank balances</h2>
          <p className="text-xs text-slate-500">Connect ledger data to populate these accounts.</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {banks.map((bank) => (
          <article key={bank.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-700">{bank.name}</p>
            <p className="mt-3 text-2xl font-bold text-slate-900">{fmtINR(bank.balance)}</p>
            <p className="mt-1 text-xs text-slate-400">Ledger integration pending</p>
          </article>
        ))}
      </div>
    </section>
  );
}
