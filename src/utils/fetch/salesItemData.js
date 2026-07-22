import { useState, useEffect } from "react";

export default function useSalesItemData() {
  const [summary, setSummary] = useState(null);
  const [topItems, setItems] = useState([]);
  const [returnItems, setReturnItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Loading dashboard...");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setStatus("loading");
        setMessage("Loading dashboard...");

        const response = await fetch(
          "http://localhost:5000/api/v1/reports/sales/items",
          {
            method: "GET",
          },
        );
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
  }, []);
  return {
    summary,
    topItems,
    returnItems,
    status,
    message,
    reload: () => setStatus("loading"),
  };
}
