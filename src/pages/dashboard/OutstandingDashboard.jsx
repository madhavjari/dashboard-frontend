import Error from "../../components/dashboard/Error";
import Loading from "../../components/dashboard/Loading";
import { fmtCompact, fmtINR } from "../../utils/format";
import useOutstandingData from "../../utils/fetch/outstandingData";
import OutstandingByPartyChart from "./components/outstandingDashboard/OutstandingByPartyChart";
import OutstandingHeader from "./components/outstandingDashboard/OutstandingHeader";
import OutstandingRegister from "./components/outstandingDashboard/OutstandingRegister";
import OutstandingSummary from "./components/outstandingDashboard/OutstandingSummary";

export default function OutstandingDashboard({ OUTSTANDING_URL, context }) {
  const { summary, invoices, partySummary, status, message, reload } =
    useOutstandingData(OUTSTANDING_URL, context);

  if (status === "loading") {
    return (
      <Loading message={message} header={`${context} Outstanding Report`} />
    );
  }

  if (status === "error") {
    return (
      <Error
        message={message}
        header={`${context} Outstanding Report`}
        reload={reload}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <OutstandingHeader context={context} />
        <OutstandingSummary
          summary={summary}
          fmtCompact={fmtCompact}
          fmtINR={fmtINR}
          context={context}
        />
        <div className="mb-6 grid grid-cols-1 gap-4">
          <OutstandingByPartyChart
            partySummary={partySummary}
            context={context}
          />
        </div>
        <OutstandingRegister
          invoices={invoices}
          fmtINR={fmtINR}
          context={context}
        />
      </div>
    </div>
  );
}
