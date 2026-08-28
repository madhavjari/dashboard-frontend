import { useEffect, useState } from "react";
import useAuthFetchOptions from "./authFetchOptions";
import useFinancialYearUrl from "./reportUrl";

export default function useBusinessSummaryData({
  salesSummaryUrl,
  purchaseSummaryUrl,
  salesOutstandingUrl,
  purchaseOutstandingUrl,
}) {
  const fetchOptions = useAuthFetchOptions();
  const selectedSalesSummaryUrl = useFinancialYearUrl(salesSummaryUrl);
  const selectedSalesOutstandingUrl = useFinancialYearUrl(
    salesOutstandingUrl,
  );
  const selectedPurchaseSummaryUrl = useFinancialYearUrl(purchaseSummaryUrl);
  const selectedPurchaseOutstandingUrl = useFinancialYearUrl(
    purchaseOutstandingUrl,
  );
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Loading your business summary...");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setStatus("loading");
        const [salesResponse, purchaseResponse, salesOutstandingResponse, purchaseOutstandingResponse] =
          await Promise.all([
            fetch(selectedSalesSummaryUrl, fetchOptions),
            fetch(selectedPurchaseSummaryUrl, fetchOptions),
            fetch(selectedSalesOutstandingUrl, fetchOptions),
            fetch(selectedPurchaseOutstandingUrl, fetchOptions),
          ]);

        if (
          !salesResponse.ok ||
          !purchaseResponse.ok ||
          !salesOutstandingResponse.ok ||
          !purchaseOutstandingResponse.ok
        ) {
          throw new Error("Failed to fetch your business summary");
        }

        const [salesData, purchaseData, salesOutstandingData, purchaseOutstandingData] =
          await Promise.all([
            salesResponse.json(),
            purchaseResponse.json(),
            salesOutstandingResponse.json(),
            purchaseOutstandingResponse.json(),
          ]);

        if (cancelled) return;

        setData({
          netSales: Number((salesData.data ?? salesData).netAmount) || 0,
          netPurchases: Number((purchaseData.data ?? purchaseData).netAmount) || 0,
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
  }, [
    fetchOptions,
    selectedPurchaseOutstandingUrl,
    selectedPurchaseSummaryUrl,
    reloadCount,
    selectedSalesOutstandingUrl,
    selectedSalesSummaryUrl,
  ]);

  return {
    data,
    status,
    message,
    reload: () => setReloadCount((count) => count + 1),
  };
}
