import { useState } from "react";

import useSalesData from "../../utils/fetch/salesData";
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

export default function SalesDashboard() {
  const { summary, customers, status, message, reload } = useSalesData();
  const [taxView, setTaxView] = useState("sales");

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-bold text-gray-900">Sales Dashboard</h1>
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
          <h1 className="text-2xl font-bold text-gray-900">Sales Dashboard</h1>
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

  const returnRate = summary.grossSales
    ? ((summary.returns / summary.grossSales) * 100).toFixed(2)
    : "0.00";

  const salesVsReturns = [
    { label: "Gross Sales", value: summary.grossSales, fill: COLORS.ink },
    { label: "Returns", value: summary.returns, fill: COLORS.red },
    { label: "Net Sales", value: summary.netSales, fill: COLORS.green },
  ];

  const gstRows = [
    {
      label: "CGST",
      sales: summary.cgstSales,
      returns: summary.cgstSalesReturn,
    },
    {
      label: "SGST",
      sales: summary.sgstSales,
      returns: summary.sgstSalesReturn,
    },
    {
      label: "IGST",
      sales: summary.igstSales,
      returns: summary.igstSalesReturn,
    },
  ];

  const pieData = gstRows
    .map((r, i) => ({
      name: r.label,
      value: taxView === "sales" ? r.sales : r.returns,
      fill: [COLORS.blue, COLORS.green, COLORS.amber][i],
    }))
    .filter((d) => d.value > 0);

  const customerChartData = customers.map((c) => ({
    ...c,
    returnRate: c.salesAmount
      ? +((c.returnAmount / c.salesAmount) * 100).toFixed(1)
      : 0,
  }));

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <DashboardHeader summary={summary} />

        <DashboardSummary summary={summary} returnRate={returnRate} />

        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <NetChart salesVsReturns={salesVsReturns} COLORS={COLORS} />
          <GstPieChart
            taxView={taxView}
            setTaxView={setTaxView}
            pieData={pieData}
          />
        </div>

        <TaxBreakdown gstRows={gstRows} />

        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <NetSales COLORS={COLORS} customerChartData={customerChartData} />
          <SalesVsParty COLORS={COLORS} customerChartData={customerChartData} />
        </div>

        <PartyWiseRegister customers={customers} />
      </div>
    </div>
  );
}
