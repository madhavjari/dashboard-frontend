import { useState, useEffect } from "react";

export default function useData(SUMMARY_URL, PARTY_URL) {
  const [summary, setSummary] = useState(null);
  const [party, setParty] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Loading dashboard...");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setStatus("loading");
        setMessage("Loading dashboard...");

        const [summaryRes, partyRes] = await Promise.all([
          fetch(SUMMARY_URL),
          fetch(PARTY_URL),
        ]);

        if (!summaryRes.ok || !partyRes.ok) {
          throw new Error("Failed to fetch sales data");
        }

        const summaryJson = await summaryRes.json();
        const customerJson = await partyRes.json();

        if (cancelled) return;

        setSummary(summaryJson.data ?? summaryJson);
        setParty(customerJson.data ?? customerJson ?? []);
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
  }, [SUMMARY_URL, PARTY_URL]);

  return {
    summary,
    party,
    status,
    message,
    reload: () => setStatus("loading"),
  };
}
