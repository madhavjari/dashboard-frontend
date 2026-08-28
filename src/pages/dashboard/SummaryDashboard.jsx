import DashboardHeader from "./components/summaryDashboard/DashboardHeader";
import DashboardSummary from "./components/summaryDashboard/DashboardSummary";
import TaxBreakdown from "./components/summaryDashboard/TaxBreakdown";
import NetSales from "./components/summaryDashboard/NetSales";
import PartyWiseRegister from "./components/summaryDashboard/PartyWiseRegister";
import MonthWiseSalesChart from "./components/summaryDashboard/MonthWiseSalesChart";
import Loading from "../../components/dashboard/Loading";
import Error from "../../components/dashboard/Error";

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
    return <Loading header={header} message={message} />;
  }

  if (status === "error") {
    return <Error header={header} message={message} reload={reload} />;
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
  }));

  return (
    <main className="app-page">
      <div className="app-page-inner">
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

        {MONTHLY_SALES_URL && (
          <div className="mb-6">
            <MonthWiseSalesChart monthlySales={monthlySales} context={context} />
          </div>
        )}

        <div className="mb-6">
          <NetSales
            customerChartData={customerChartData}
            context={context}
          />
        </div>
        <PartyWiseRegister party={party} context={context} />
        <TaxBreakdown gstRows={gstRows} context={context} />
      </div>
    </main>
  );
}
