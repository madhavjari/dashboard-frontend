import { useState, useEffect } from "react";

export default function usePartyData(PARTY_URL, party, OUTSTANDING_URL) {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [outstandingAmount, setOutstandingAmount] = useState(0);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Loading dashboard...");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setStatus("loading");
        setMessage("Loading dashboard...");

        const [partyResponse, outstandingResponse] = await Promise.all([
          fetch(`${PARTY_URL}${party}`),
          fetch(OUTSTANDING_URL),
        ]);
        if (!partyResponse.ok || !outstandingResponse.ok) {
          throw new Error("Failed to fetch sales data");
        }
        const [data, outstandingData] = await Promise.all([
          partyResponse.json(),
          outstandingResponse.json(),
        ]);

        if (cancelled) return;

        const partyName = String(party || "").toUpperCase();
        const partyOutstanding = (outstandingData.partySummary ?? []).find(
          (entry) => String(entry.party || "").toUpperCase() === partyName,
        );

        setTransactions(data.data ?? []);
        setSummary(data.summary?.[0] ?? null);
        setOutstandingAmount(
          Number(
            partyOutstanding?.amountToCollect ?? partyOutstanding?.amountToPay,
          ) || 0,
        );
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
  }, [OUTSTANDING_URL, PARTY_URL, party, reloadCount]);
  return {
    summary,
    transactions,
    outstandingAmount,
    status,
    message,
    reload: () => setReloadCount((count) => count + 1),
  };
}
