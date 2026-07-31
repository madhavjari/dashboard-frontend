import Error from "../../components/dashboard/Error";
import Loading from "../../components/dashboard/Loading";
import { fmtCompact, fmtINR } from "../../utils/format";
import useBusinessSummaryData from "../../utils/fetch/businessSummaryData";
import BusinessMetrics, {
  BankBalances,
  MorningFocus,
} from "./components/businessSummary/BusinessMetrics";

export default function BusinessSummaryPage({ urls }) {
  const { data, status, message, reload } = useBusinessSummaryData(urls);

  if (status === "loading") {
    return <Loading header="Business Summary" message={message} />;
  }

  if (status === "error") {
    return <Error header="Business Summary" message={message} reload={reload} />;
  }

  return (
    <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
          <header className="mb-8">
            <p className="text-sm font-semibold text-teal-700">Good morning</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Your business, at a glance.
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              The numbers worth checking before your day gets busy.
            </p>
          </header>
          <BusinessMetrics summary={data} fmtCompact={fmtCompact} fmtINR={fmtINR} />
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_1fr]">
            <MorningFocus summary={data} fmtINR={fmtINR} />
            <BankBalances fmtINR={fmtINR} />
          </div>
      </div>
    </main>
  );
}
