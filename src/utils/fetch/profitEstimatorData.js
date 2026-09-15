import { useEffect, useState } from "react";
import useAuthFetchOptions from "./authFetchOptions";
import useFinancialYearUrl from "./reportUrl";

function toNumber(value) {
  return Number(value) || 0;
}

function getNetValueExcludingGst(summary) {
  const netValue = toNumber(summary.netAmount);
  const netGst =
    toNumber(summary.cgst) +
    toNumber(summary.sgst) +
    toNumber(summary.igst) -
    toNumber(summary.cgstReturn) -
    toNumber(summary.sgstReturn) -
    toNumber(summary.igstReturn);

  return netValue - netGst;
}

export default function useProfitEstimatorData({
  salesSummaryUrl,
  purchaseSummaryUrl,
  salesItemsUrl,
}) {
  const fetchOptions = useAuthFetchOptions();
  const salesUrl = useFinancialYearUrl(salesSummaryUrl);
  const purchasesUrl = useFinancialYearUrl(purchaseSummaryUrl);
  const itemsUrl = useFinancialYearUrl(salesItemsUrl);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Loading profit inputs...");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setStatus("loading");
        setMessage("Loading profit inputs...");

        const responses = await Promise.all([
          fetch(salesUrl, fetchOptions),
          fetch(purchasesUrl, fetchOptions),
          fetch(itemsUrl, fetchOptions),
        ]);
        if (responses.some((response) => !response.ok)) {
          throw new Error("Unable to load sales, purchases, and item data");
        }

        const [salesPayload, purchasesPayload, itemsPayload] =
          await Promise.all(responses.map((response) => response.json()));
        if (cancelled) return;

        const salesSummary = salesPayload.data ?? salesPayload;
        const purchaseSummary = purchasesPayload.data ?? purchasesPayload;

        setData({
          recordedSales: getNetValueExcludingGst(salesSummary),
          recordedPurchases: getNetValueExcludingGst(purchaseSummary),
          items: itemsPayload.topItems ?? [],
        });
        setStatus("success");
      } catch (error) {
        if (cancelled) return;
        setMessage(error.message || "Unable to load profit inputs");
        setStatus("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [fetchOptions, itemsUrl, purchasesUrl, reloadCount, salesUrl]);

  return {
    data,
    status,
    message,
    reload: () => setReloadCount((count) => count + 1),
  };
}
