import { useEffect, useState } from "react";

function getAveragePaymentDaysByParty(invoices) {
  const paymentDaysByParty = new Map();

  invoices.forEach((invoice) => {
    if (Number(invoice.amountOutstanding) !== 0 || !invoice.payments?.length) {
      return;
    }

    const billTime = new Date(invoice.billDate).getTime();
    const finalPaymentTime = invoice.payments.reduce((latest, payment) => {
      const paymentTime = new Date(
        payment.clearingDate || payment.chequeDate,
      ).getTime();
      return Number.isNaN(paymentTime) ? latest : Math.max(latest, paymentTime);
    }, Number.NEGATIVE_INFINITY);

    if (Number.isNaN(billTime) || !Number.isFinite(finalPaymentTime)) return;

    const party = String(invoice.party || "").trim().toUpperCase();
    if (!party) return;

    const paymentDays = Math.max(
      0,
      Math.round((finalPaymentTime - billTime) / 86_400_000),
    );
    const timing = paymentDaysByParty.get(party) || { total: 0, count: 0 };
    timing.total += paymentDays;
    timing.count += 1;
    paymentDaysByParty.set(party, timing);
  });

  const partyAverages = [...paymentDaysByParty.values()]
    .filter((timing) => timing.count > 0)
    .map((timing) => timing.total / timing.count);

  return {
    averagePaymentDays: partyAverages.length
      ? partyAverages.reduce((total, average) => total + average, 0) /
        partyAverages.length
      : null,
    partyPaymentCount: partyAverages.length,
  };
}

function normalizeReport(data, context) {
  const isSales = context === "Sales";
  const sourceSummary = data.summary ?? {};
  const totalTransactionAmount = Number(
    isSales ? sourceSummary.totalSalesAmount : sourceSummary.totalPurchaseAmount,
  ) || 0;
  const totalReturnAmount = Number(
    isSales
      ? sourceSummary.totalSalesReturnAmount
      : sourceSummary.totalPurchaseReturnAmount,
  ) || 0;
  const netTransactionAmount = Math.max(0, totalTransactionAmount - totalReturnAmount);
  const totalOutstandingAmount = Number(
    isSales ? sourceSummary.totalToCollect : sourceSummary.totalToPay,
  ) || 0;
  const invoices = (data.data ?? []).map((invoice) => ({
    ...invoice,
    amountOutstanding: isSales
      ? invoice.amountToCollect
      : invoice.amountToPay,
  }));
  const paymentTiming = getAveragePaymentDaysByParty(invoices);

  return {
    summary: {
      netTransactionAmount,
      totalAdjustedAmount: sourceSummary.totalAdjustedAmount,
      totalReturnAmount,
      totalOutstandingAmount,
      outstandingRate: netTransactionAmount
        ? (totalOutstandingAmount / netTransactionAmount) * 100
        : 0,
      ...paymentTiming,
      totalOverpaidAmount: sourceSummary.totalOverpaidAmount,
      invoiceCount: sourceSummary.invoiceCount,
      paidInvoiceCount: sourceSummary.paidInvoiceCount,
      outstandingInvoiceCount: sourceSummary.outstandingInvoiceCount,
    },
    invoices,
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
