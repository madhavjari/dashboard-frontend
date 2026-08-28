import { useSearchParams } from "react-router";
import Error from "../../components/dashboard/Error";
import Loading from "../../components/dashboard/Loading";
import { fmtCompact, fmtINR } from "../../utils/format";
import usePartyData from "../../utils/fetch/partyData";
import CustomerDetailHeader from "./components/customerDetail/CustomerDetailHeader";
import CustomerSummary from "./components/customerDetail/CustomerSummary";
import ItemValueQuantityChart from "./components/customerDetail/ItemValueQuantityChart";
import TransactionRegister from "./components/customerDetail/TransactionRegister";

function fmtNumber(number, digits = 0) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: digits,
  }).format(number);
}

export default function PartyDetailPage({
  PARTY_URL,
  OUTSTANDING_URL,
  context,
}) {
  const [searchParams] = useSearchParams();
  const party = searchParams.get("party");
  const {
    summary,
    transactions,
    outstandingAmount,
    averagePaymentDays,
    paidInvoiceCount,
    status,
    message,
    reload,
  } = usePartyData(PARTY_URL, party, OUTSTANDING_URL);

  if (status === "loading") {
    return <Loading message={message} header="Customer Summary" />;
  }

  if (status === "error") {
    return (
      <Error message={message} header="Customer Summary" reload={reload} />
    );
  }

  return (
    <main className="app-page">
      <div className="app-page-inner">
        <CustomerDetailHeader party={party} context={context} />
        <CustomerSummary
          summary={summary}
          fmtCompact={fmtCompact}
          fmtINR={fmtINR}
          context={context}
          outstandingAmount={outstandingAmount}
          averagePaymentDays={averagePaymentDays}
          paidInvoiceCount={paidInvoiceCount}
        />
        <ItemValueQuantityChart transactions={transactions} context={context} />
        <TransactionRegister
          transactions={transactions}
          fmtNumber={fmtNumber}
          fmtINR={fmtINR}
        />
      </div>
    </main>
  );
}
