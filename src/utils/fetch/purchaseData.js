//   "/api/v1/reports/purchases/KPI-summary"
//   "/api/v1/reports/purchases/suppliers"

import { useState, useEffect } from "react";

const SUMMARY_URL =
  "http://localhost:5000/api/v1/reports/purchases/KPI-Summary";
const CUSTOMER_URL = "http://localhost:5000/api/v1/reports/purchases/suppliers";

export default function usePurchasesData() {
  const [summary, setSummary] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Loading dashboard...");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setStatus("loading");
        setMessage("Loading dashboard...");

        const [summaryRes, supplierRes] = await Promise.all([
          fetch(SUMMARY_URL),
          fetch(CUSTOMER_URL),
        ]);

        if (!summaryRes.ok || !supplierRes.ok) {
          throw new Error("Failed to fetch sales data");
        }

        const summaryJson = await summaryRes.json();
        const supplierJson = await supplierRes.json();

        if (cancelled) return;

        setSummary(summaryJson.salesData ?? summaryJson);
        setSuppliers(supplierJson.salesData ?? supplierJson ?? []);
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
    suppliers,
    status,
    message,
    reload: () => setStatus("loading"),
  };
}
