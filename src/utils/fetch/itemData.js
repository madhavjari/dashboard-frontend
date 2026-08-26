import { useState, useEffect } from "react";
import useAuthFetchOptions from "./authFetchOptions";
import useFinancialYearUrl from "./reportUrl";

export default function useItemData(ITEMS_URL) {
  const fetchOptions = useAuthFetchOptions();
  const itemsUrl = useFinancialYearUrl(ITEMS_URL);
  const [summary, setSummary] = useState(null);
  const [topItems, setItems] = useState([]);
  const [returnItems, setReturnItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Loading dashboard...");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setStatus("loading");
        setMessage("Loading dashboard...");

        const response = await fetch(itemsUrl, fetchOptions);
        if (!response.ok) {
          throw new Error("Failed to fetch sales data");
        }
        const data = await response.json();

        if (cancelled) return;

        setSummary(data.summary ?? data);
        setItems(data.topItems ?? data ?? []);
        setReturnItems(data.returnItems ?? data ?? []);
        setStatus("success");
      } catch (err) {
        if (cancelled) return;
        setMessage(err.message || "Something went wrong while loading data");
        setStatus("error");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [fetchOptions, itemsUrl, reloadCount]);
  return {
    summary,
    topItems,
    returnItems,
    status,
    message,
    reload: () => setReloadCount((count) => count + 1),
  };
}
