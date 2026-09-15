import { lazy, Suspense } from "react";
import { reports } from "../../config/reports";
import useData from "../../utils/fetch/useData";
import Loading from "../../components/dashboard/Loading";
import BusinessSummaryPage from "./BusinessSummaryPage";
import PartyDetailPage from "./PartyDetailPage";
import ItemDashboard from "./ItemDashboard";
import ItemDetailPage from "./ItemDetailPage";
import OutstandingDashboard from "./OutstandingDashboard";
import InvoiceDashboard from "./InvoiceDashboard";
import SummaryDashboard from "./SummaryDashboard";

const ProfitEstimator = lazy(() => import("./ProfitEstimator"));

export default function DashboardPage({ page, reportType, estimatorView }) {
  if (page === "business-summary") {
    return (
      <BusinessSummaryPage
        urls={{
          salesSummaryUrl: reports.sales.summaryUrl,
          purchaseSummaryUrl: reports.purchase.summaryUrl,
          salesOutstandingUrl: reports.sales.outstandingUrl,
          purchaseOutstandingUrl: reports.purchase.outstandingUrl,
        }}
      />
    );
  }

  if (page === "profit-estimator") {
    return (
      <Suspense
        fallback={
          <Loading
            header="Profit estimator"
            message="Preparing profit estimator..."
          />
        }
      >
        <ProfitEstimator
          salesSummaryUrl={reports.sales.summaryUrl}
          purchaseSummaryUrl={reports.purchase.summaryUrl}
          salesItemsUrl={reports.sales.itemsUrl}
          view={estimatorView}
        />
      </Suspense>
    );
  }

  const report = reports[reportType];
  if (!report) throw new Error(`Unknown report type: ${reportType}`);

  switch (page) {
    case "summary":
      return (
        <SummaryDashboard
          header={`${report.label} Dashboard`}
          context={report.label}
          useData={useData}
          SUMMARY_URL={report.summaryUrl}
          PARTY_URL={report.partyUrl}
          MONTHLY_SALES_URL={report.monthlyUrl}
        />
      );
    case "items":
      return (
        <ItemDashboard ITEMS_URL={report.itemsUrl} context={report.label} />
      );
    case "outstanding":
      return (
        <OutstandingDashboard
          OUTSTANDING_URL={report.outstandingUrl}
          context={report.label}
        />
      );
    case "invoices":
      return (
        <InvoiceDashboard
          INVOICES_URL={report.invoicesUrl}
          context={report.label}
        />
      );
    case "party-details":
      return (
        <PartyDetailPage
          PARTY_URL={report.partyDetailsUrl}
          OUTSTANDING_URL={report.outstandingUrl}
          context={report.label}
        />
      );
    case "item-details":
      return (
        <ItemDetailPage
          ITEM_URL={report.itemDetailsUrl}
          OUTSTANDING_URL={report.outstandingUrl}
          context={report.label}
        />
      );
    default:
      throw new Error(`Unknown dashboard page: ${page}`);
  }
}
