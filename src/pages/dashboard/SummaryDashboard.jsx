import DashboardHeader from "./components/summaryDashboard/DashboardHeader";
import DashboardSummary from "./components/summaryDashboard/DashboardSummary";
import TaxBreakdown from "./components/summaryDashboard/TaxBreakdown";
import NetSales from "./components/summaryDashboard/NetSales";
import SalesVsParty from "./components/summaryDashboard/SalesVsParty";
import PartyWiseRegister from "./components/summaryDashboard/PartyWiseRegister";
import MonthWiseSalesChart from "./components/summaryDashboard/MonthWiseSalesChart";

const COLORS = {
  ink: "#1e293b",
  green: "#16a34a",
  red: "#dc2626",
  amber: "#d97706",
  grid: "#e2e8f0",
};

export default function SummaryDashboard({
  header,
  context,
  useData,
  SUMMARY_URL,
  PARTY_URL,
  MONTHLY_SALES_URL,
}) {
  const {
    summary,
    party,
    outstandingSummary,
    monthlySales,
    status,
    message,
    reload,
  } = useData(SUMMARY_URL, PARTY_URL, MONTHLY_SALES_URL);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-bold text-gray-900">{header}</h1>
          <div className="mt-6">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
            <p className="text-blue-600">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-bold text-gray-900">{header}</h1>
          <div className="mt-6">
            <p className="text-red-600">{message}</p>
            <button
              onClick={reload}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const returnRate = summary.grossAmount
    ? ((summary.returns / summary.grossAmount) * 100).toFixed(2)
    : "0.00";
  const outstandingAmount =
    outstandingSummary?.totalToCollect ?? outstandingSummary?.totalToPay;

  const debtorDays =
    summary?.netAmount != null &&
    summary.netAmount !== 0 &&
    outstandingAmount != null
      ? (outstandingAmount / summary.netAmount) * 365
      : null;

  const gstRows = [
    {
      label: "CGST",
      context: summary.cgst,
      returns: summary.cgstReturn,
    },
    {
      label: "SGST",
      context: summary.sgst,
      returns: summary.sgstReturn,
    },
    {
      label: "IGST",
      context: summary.igst,
      returns: summary.igstReturn,
    },
  ];

  const customerChartData = party.map((c) => ({
    ...c,
    returnRate: c.grossAmount
      ? +((c.returnAmount / c.grossAmount) * 100).toFixed(1)
      : 0,
  }));
  const hasReturns = customerChartData.some(
    (customer) => Number(customer.returnAmount) > 0,
  );

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <DashboardHeader
          title1={summary.invoiceCount}
          title2={summary.returnCount}
          title3={header}
        />

        <DashboardSummary
          summary={summary}
          returnRate={returnRate}
          context={context}
          debtorDays={debtorDays}
        />

        <TaxBreakdown gstRows={gstRows} context={context} />

        {MONTHLY_SALES_URL && (
          <div className="mb-6">
            <MonthWiseSalesChart monthlySales={monthlySales} context={context} />
          </div>
        )}

        <div className="mb-6">
          <NetSales
            COLORS={COLORS}
            customerChartData={customerChartData}
            context={context}
          />
        </div>
        {hasReturns && (
          <div className="mb-6">
            <SalesVsParty
              COLORS={COLORS}
              customerChartData={customerChartData}
              context={context}
            />
          </div>
        )}

        <PartyWiseRegister party={party} context={context} />
      </div>
    </div>
  );
}
