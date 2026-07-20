import { useState, useEffect } from "react";

const SUMMARY_URL = "http://localhost:5000/api/v1/reports/sales/KPI-Summary";
const CUSTOMER_URL = "http://localhost:5000/api/v1/reports/sales/customers";

export default function useSalesData() {
  const [summary, setSummary] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Loading dashboard...");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setStatus("loading");
        setMessage("Loading dashboard...");

        const [summaryRes, customerRes] = await Promise.all([
          fetch(SUMMARY_URL),
          fetch(CUSTOMER_URL),
        ]);

        if (!summaryRes.ok || !customerRes.ok) {
          throw new Error("Failed to fetch sales data");
        }

        const summaryJson = await summaryRes.json();
        const customerJson = await customerRes.json();

        if (cancelled) return;

        setSummary(summaryJson.salesData ?? summaryJson);
        setCustomers(customerJson.salesData ?? customerJson ?? []);
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
    customers,
    status,
    message,
    reload: () => setStatus("loading"),
  };
}
