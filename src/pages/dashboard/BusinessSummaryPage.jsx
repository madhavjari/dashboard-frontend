import Error from "../../components/dashboard/Error";
import Loading from "../../components/dashboard/Loading";
import { fmtCompact, fmtINR } from "../../utils/format";
import useBusinessSummaryData from "../../utils/fetch/businessSummaryData";
import BusinessMetrics, {
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
    <main className="app-page min-w-0 flex-1">
      <div className="app-page-inner">
          <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-teal-700">Overview</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Business health
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm text-slate-600">
                Sales, purchases, and money due for the selected financial year.
              </p>
            </div>
            <p className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500">
              Updated from synced accounting data
            </p>
          </header>
          <BusinessMetrics summary={data} fmtCompact={fmtCompact} fmtINR={fmtINR} />
          <div className="mt-6">
            <MorningFocus summary={data} fmtINR={fmtINR} />
          </div>
      </div>
    </main>
  );
}
