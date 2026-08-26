import { useState, useEffect } from "react";
import useAuthFetchOptions from "./authFetchOptions";
import useFinancialYearUrl from "./reportUrl";

export default function useData(
  SUMMARY_URL,
  PARTY_URL,
  MONTHLY_SALES_URL,
) {
  const fetchOptions = useAuthFetchOptions();
  const summaryUrl = useFinancialYearUrl(SUMMARY_URL);
  const partyUrl = useFinancialYearUrl(PARTY_URL);
  const monthlySalesUrl = useFinancialYearUrl(MONTHLY_SALES_URL);
  const [summary, setSummary] = useState(null);
  const [party, setParty] = useState([]);
  const [outstandingSummary, setOutstandingSummary] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Loading dashboard...");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setStatus("loading");
        setMessage("Loading dashboard...");

        const requests = [
          fetch(summaryUrl, fetchOptions),
          fetch(partyUrl, fetchOptions),
        ];
        if (monthlySalesUrl) {
          requests.push(fetch(monthlySalesUrl, fetchOptions));
        }

        const [summaryRes, partyRes, monthlySalesRes] = await Promise.all(
          requests,
        );

        if (
          !summaryRes.ok ||
          !partyRes.ok ||
          (monthlySalesRes && !monthlySalesRes.ok)
        ) {
          throw new Error("Failed to fetch sales data");
        }

        const [summaryJson, customerJson, monthlySalesJson] = await Promise.all([
          summaryRes.json(),
          partyRes.json(),
          monthlySalesRes?.json(),
        ]);

        if (cancelled) return;

        setSummary(summaryJson.data ?? summaryJson);
        setParty(customerJson.data ?? customerJson ?? []);
        setOutstandingSummary(customerJson.outstandingSummary ?? null);
        setMonthlySales(monthlySalesJson?.data ?? []);
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
  }, [
    summaryUrl,
    partyUrl,
    monthlySalesUrl,
    fetchOptions,
    reloadCount,
  ]);
  return {
    summary,
    party,
    outstandingSummary,
    monthlySales,
    status,
    message,
    reload: () => setReloadCount((count) => count + 1),
  };
}
