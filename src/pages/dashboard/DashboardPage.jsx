import { reports } from "../../config/reports";
import useData from "../../utils/fetch/useData";
import BusinessSummaryPage from "./BusinessSummaryPage";
import PartyDetailPage from "./PartyDetailPage";
import ItemDashboard from "./ItemDashboard";
import ItemDetailPage from "./ItemDetailPage";
import OutstandingDashboard from "./OutstandingDashboard";
import InvoiceDashboard from "./InvoiceDashboard";
import SummaryDashboard from "./SummaryDashboard";

export default function DashboardPage({ page, reportType }) {
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
          context={report.label}
        />
      );
    default:
      throw new Error(`Unknown dashboard page: ${page}`);
  }
}
