import { useState, useEffect } from "react";

export default function usePartyData(PARTY_URL, party) {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Loading dashboard...");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setStatus("loading");
        setMessage("Loading dashboard...");

        const response = await fetch(`${PARTY_URL}${party}`);
        if (!response.ok) {
          throw new Error("Failed to fetch sales data");
        }
        const data = await response.json();

        if (cancelled) return;

        setTransactions(data.data);
        setSummary(data.summary[0]);
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
  }, [PARTY_URL, party]);
  return {
    summary,
    transactions,
    status,
    message,
    reload: () => setStatus("loading"),
  };
}
