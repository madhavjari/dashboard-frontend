import { useState } from "react";
import DashboardHeader from "./components/DashboardHeader";
import DashboardSummary from "./components/DashboardSummary";
import NetChart from "./components/NetChart";
import GstPieChart from "./components/GstPieChart";
import TaxBreakdown from "./components/TaxBreakdown";
import NetSales from "./components/NetSales";
import SalesVsParty from "./components/SalesVsParty";
import PartyWiseRegister from "./components/PartyWiseRegister";

const COLORS = {
  ink: "#1e293b",
  blue: "#2563eb",
  green: "#16a34a",
  red: "#dc2626",
  amber: "#d97706",
  grid: "#e2e8f0",
};

export default function SummaryDashboard({ header, context, useData }) {
  const { summary, customers, status, message, reload } = useData();
  const [taxView, setTaxView] = useState(context);

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

  const contextVsReturns = [
    { label: `Gross ${context}`, value: summary.grossAmount, fill: COLORS.ink },
    { label: "Returns", value: summary.returns, fill: COLORS.red },
    { label: `Net ${context}`, value: summary.netAmount, fill: COLORS.green },
  ];

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

  const pieData = gstRows
    .map((r, i) => ({
      name: r.label,
      value: taxView === context ? r.context : r.returns,
      fill: [COLORS.blue, COLORS.green, COLORS.amber][i],
    }))
    .filter((d) => d.value > 0);

  const customerChartData = customers.map((c) => ({
    ...c,
    returnRate: c.grossAmount
      ? +((c.returnAmount / c.grossAmount) * 100).toFixed(1)
      : 0,
  }));

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
        />

        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <NetChart contextVsReturns={contextVsReturns} COLORS={COLORS} />
          <GstPieChart
            taxView={taxView}
            setTaxView={setTaxView}
            pieData={pieData}
            context={context}
          />
        </div>

        <TaxBreakdown gstRows={gstRows} context={context} />

        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <NetSales
            COLORS={COLORS}
            customerChartData={customerChartData}
            context={context}
          />
          <SalesVsParty
            COLORS={COLORS}
            customerChartData={customerChartData}
            context={context}
          />
        </div>

        <PartyWiseRegister customers={customers} context={context} />
      </div>
    </div>
  );
}
