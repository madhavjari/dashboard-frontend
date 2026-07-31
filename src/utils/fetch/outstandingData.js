import { useEffect, useState } from "react";

function normalizeReport(data, context) {
  const isSales = context === "Sales";
  const sourceSummary = data.summary ?? {};

  return {
    summary: {
      totalTransactionAmount: isSales
        ? sourceSummary.totalSalesAmount
        : sourceSummary.totalPurchaseAmount,
      totalAdjustedAmount: sourceSummary.totalAdjustedAmount,
      totalReturnAmount: isSales ? sourceSummary.totalSalesReturnAmount : 0,
      totalOutstandingAmount: isSales
        ? sourceSummary.totalToCollect
        : sourceSummary.totalToPay,
      totalOverpaidAmount: sourceSummary.totalOverpaidAmount,
      invoiceCount: sourceSummary.invoiceCount,
      paidInvoiceCount: sourceSummary.paidInvoiceCount,
      outstandingInvoiceCount: sourceSummary.outstandingInvoiceCount,
    },
    invoices: (data.data ?? []).map((invoice) => ({
      ...invoice,
      amountOutstanding: isSales
        ? invoice.amountToCollect
        : invoice.amountToPay,
    })),
    partySummary: (data.partySummary ?? []).map((party) => ({
      ...party,
      amountOutstanding: isSales ? party.amountToCollect : party.amountToPay,
    })),
  };
}

export default function useOutstandingData(OUTSTANDING_URL, context) {
  const [summary, setSummary] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [partySummary, setPartySummary] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Loading outstanding report...");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setStatus("loading");
        setMessage("Loading outstanding report...");

        const response = await fetch(OUTSTANDING_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch outstanding report");
        }

        const data = await response.json();
        if (cancelled) return;

        const report = normalizeReport(data, context);
        setSummary(report.summary);
        setInvoices(report.invoices);
        setPartySummary(report.partySummary);
        setStatus("success");
      } catch (error) {
        if (cancelled) return;
        setMessage(
          error.message || "Something went wrong while loading the report",
        );
        setStatus("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [OUTSTANDING_URL, context, reloadCount]);

  return {
    summary,
    invoices,
    partySummary,
    status,
    message,
    reload: () => setReloadCount((count) => count + 1),
  };
}
