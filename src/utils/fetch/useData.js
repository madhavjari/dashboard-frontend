import { useState, useEffect } from "react";

export default function useData(SUMMARY_URL, PARTY_URL, OUTSTANDING_URL) {
  const [summary, setSummary] = useState(null);
  const [party, setParty] = useState([]);
  const [outstandingSummary, setOutstandingSummary] = useState(null);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Loading dashboard...");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setStatus("loading");
        setMessage("Loading dashboard...");

        const requests = [fetch(SUMMARY_URL), fetch(PARTY_URL)];
        if (OUTSTANDING_URL) requests.push(fetch(OUTSTANDING_URL));

        const [summaryRes, partyRes, outstandingRes] =
          await Promise.all(requests);

        if (!summaryRes.ok || !partyRes.ok || !outstandingRes.ok) {
          throw new Error("Failed to fetch sales data");
        }

        const [summaryJson, customerJson, outstandingJson] = await Promise.all([
          summaryRes.json(),
          partyRes.json(),
          outstandingRes.json(),
        ]);

        if (cancelled) return;

        setSummary(summaryJson.data ?? summaryJson);
        setParty(customerJson.data ?? customerJson ?? []);
        setOutstandingSummary(outstandingJson.summary ?? null);
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
  }, [SUMMARY_URL, PARTY_URL, OUTSTANDING_URL, reloadCount]);
  return {
    summary,
    party,
    outstandingSummary,
    status,
    message,
    reload: () => setReloadCount((count) => count + 1),
  };
}
