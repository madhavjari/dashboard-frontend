import { useState } from "react";
import { useOutletContext } from "react-router";
import Error from "../../components/dashboard/Error";
import Loading from "../../components/dashboard/Loading";
import { fmtCompact, fmtINR } from "../../utils/format";
import useOutstandingData from "../../utils/fetch/outstandingData";
import OutstandingByPartyChart from "./components/outstandingDashboard/OutstandingByPartyChart";
import OutstandingHeader from "./components/outstandingDashboard/OutstandingHeader";
import OutstandingRegister from "./components/outstandingDashboard/OutstandingRegister";
import OutstandingSummary from "./components/outstandingDashboard/OutstandingSummary";
import InvoiceAgeBreakdown from "./components/outstandingDashboard/InvoiceAgeBreakdown";
import ManualPaymentDialog from "./components/invoiceDashboard/ManualPaymentDialog";

export default function OutstandingDashboard({ OUTSTANDING_URL, context }) {
  const { accessToken, financialYear } = useOutletContext() ?? {};
  const [selectedInvoice, setSelectedInvoice] = useState(null);
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
    <main className="app-page">
      <div className="app-page-inner">
        <OutstandingHeader context={context} />
        <OutstandingSummary
          summary={summary}
          fmtCompact={fmtCompact}
          fmtINR={fmtINR}
          context={context}
          invoices={invoices}
        />
        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <InvoiceAgeBreakdown invoices={invoices} context={context} />
          <OutstandingByPartyChart
            partySummary={partySummary}
            context={context}
          />
        </div>
        <OutstandingRegister
          invoices={invoices}
          fmtINR={fmtINR}
          context={context}
          canRecordPayments={Boolean(accessToken)}
          onRecordPayment={setSelectedInvoice}
        />
      </div>
      {selectedInvoice ? (
        <ManualPaymentDialog
          accessToken={accessToken}
          context={context}
          financialYear={financialYear || selectedInvoice.financialYear}
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onSaved={reload}
        />
      ) : null}
    </main>
  );
}
