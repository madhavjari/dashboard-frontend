import { useEffect, useMemo, useState } from "react";
import useAuthFetchOptions from "./authFetchOptions";
import useFinancialYearUrl from "./reportUrl";
import {
  createInvoiceDetailsMap,
  createInvoiceStatusMap,
  getInvoiceDetails,
  getInvoiceStatus,
} from "../invoiceStatus";
import { getInvoiceAgeDays, getInvoicePaymentDays } from "../invoiceAge";

export default function useItemDetailData(ITEM_URL, item, OUTSTANDING_URL) {
  const fetchOptions = useAuthFetchOptions();
  const itemBaseUrl = useMemo(
    () => `${ITEM_URL}${encodeURIComponent(item ?? "")}`,
    [ITEM_URL, item],
  );
  const itemUrl = useFinancialYearUrl(itemBaseUrl);
  const outstandingUrl = useFinancialYearUrl(OUTSTANDING_URL);
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Loading item details...");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setStatus("loading");
        setMessage("Loading item details...");

        const [itemResponse, outstandingResponse] = await Promise.all([
          fetch(itemUrl, fetchOptions),
          fetch(outstandingUrl, fetchOptions),
        ]);
        if (!itemResponse.ok || !outstandingResponse.ok) {
          throw new Error("Failed to fetch item data");
        }

        const [data, outstandingData] = await Promise.all([
          itemResponse.json(),
          outstandingResponse.json(),
        ]);
        if (cancelled) return;

        const invoices = outstandingData.data ?? [];
        const statusMap = createInvoiceStatusMap(invoices);
        const invoiceMap = createInvoiceDetailsMap(invoices);
        const transactions = (data.data ?? []).map((transaction) => {
          const paymentStatus = getInvoiceStatus(statusMap, transaction);
          const invoice = getInvoiceDetails(invoiceMap, transaction);
          const statusDays =
            paymentStatus === "Paid"
              ? getInvoicePaymentDays(invoice?.billDate, invoice?.payments)
              : paymentStatus === "Unpaid"
                ? getInvoiceAgeDays(transaction.billDate)
                : null;

          return { ...transaction, paymentStatus, statusDays };
        });

        setTransactions(transactions);
        setSummary(data.summary?.[0] ?? data.summary ?? null);
        setStatus("success");
      } catch (error) {
        if (cancelled) return;
        setMessage(error.message || "Something went wrong while loading item data");
        setStatus("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [fetchOptions, itemUrl, outstandingUrl]);

  return {
    summary,
    transactions,
    status,
    message,
    reload: () => setStatus("loading"),
  };
}
