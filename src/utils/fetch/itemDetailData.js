import { useEffect, useMemo, useState } from "react";
import useAuthFetchOptions from "./authFetchOptions";
import useFinancialYearUrl from "./reportUrl";

export default function useItemDetailData(ITEM_URL, item) {
  const fetchOptions = useAuthFetchOptions();
  const itemBaseUrl = useMemo(
    () => `${ITEM_URL}${encodeURIComponent(item ?? "")}`,
    [ITEM_URL, item],
  );
  const itemUrl = useFinancialYearUrl(itemBaseUrl);
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

        const response = await fetch(
          itemUrl,
          fetchOptions,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch item data");
        }

        const data = await response.json();
        if (cancelled) return;

        setTransactions(data.data ?? []);
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
  }, [fetchOptions, itemUrl]);

  return {
    summary,
    transactions,
    status,
    message,
    reload: () => setStatus("loading"),
  };
}
