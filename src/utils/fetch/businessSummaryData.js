import { useEffect, useState } from "react";

export default function useBusinessSummaryData({
  salesSummaryUrl,
  salesOutstandingUrl,
  purchaseOutstandingUrl,
}) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Loading your business summary...");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setStatus("loading");
        const [salesResponse, salesOutstandingResponse, purchaseOutstandingResponse] =
          await Promise.all([
            fetch(salesSummaryUrl),
            fetch(salesOutstandingUrl),
            fetch(purchaseOutstandingUrl),
          ]);

        if (
          !salesResponse.ok ||
          !salesOutstandingResponse.ok ||
          !purchaseOutstandingResponse.ok
        ) {
          throw new Error("Failed to fetch your business summary");
        }

        const [salesData, salesOutstandingData, purchaseOutstandingData] =
          await Promise.all([
            salesResponse.json(),
            salesOutstandingResponse.json(),
            purchaseOutstandingResponse.json(),
          ]);

        if (cancelled) return;

        setData({
          netSales: Number((salesData.data ?? salesData).netAmount) || 0,
          salesOutstanding:
            Number(salesOutstandingData.summary?.totalToCollect) || 0,
          purchaseOutstanding:
            Number(purchaseOutstandingData.summary?.totalToPay) || 0,
        });
        setStatus("success");
      } catch (error) {
        if (cancelled) return;
        setMessage(error.message || "Something went wrong while loading the summary");
        setStatus("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [purchaseOutstandingUrl, reloadCount, salesOutstandingUrl, salesSummaryUrl]);

  return {
    data,
    status,
    message,
    reload: () => setReloadCount((count) => count + 1),
  };
}
