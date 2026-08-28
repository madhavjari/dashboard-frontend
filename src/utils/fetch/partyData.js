import { useEffect, useMemo, useState } from "react";
import useAuthFetchOptions from "./authFetchOptions";
import useFinancialYearUrl from "./reportUrl";

function getAveragePaymentDays(entries, party) {
  const partyName = String(party || "").trim().toUpperCase();
  const paidInvoiceDays = entries.flatMap((entry) => {
    if (String(entry.party || "").trim().toUpperCase() !== partyName) {
      return [];
    }

    const remainingAmount = Number(
      entry.amountToCollect ?? entry.amountToPay,
    );
    if (remainingAmount !== 0 || !entry.payments?.length) return [];

    const billTime = new Date(entry.billDate).getTime();
    const finalPaymentTime = entry.payments.reduce((latest, payment) => {
      const paymentTime = new Date(
        payment.clearingDate || payment.chequeDate,
      ).getTime();
      return Number.isNaN(paymentTime) ? latest : Math.max(latest, paymentTime);
    }, Number.NEGATIVE_INFINITY);

    if (Number.isNaN(billTime) || !Number.isFinite(finalPaymentTime)) {
      return [];
    }

    return [Math.max(0, Math.round((finalPaymentTime - billTime) / 86_400_000))];
  });

  if (!paidInvoiceDays.length) {
    return { averagePaymentDays: null, paidInvoiceCount: 0 };
  }

  return {
    averagePaymentDays:
      paidInvoiceDays.reduce((total, days) => total + days, 0) /
      paidInvoiceDays.length,
    paidInvoiceCount: paidInvoiceDays.length,
  };
}

export default function usePartyData(PARTY_URL, party, OUTSTANDING_URL) {
  const fetchOptions = useAuthFetchOptions();
  const partyBaseUrl = useMemo(
    () => `${PARTY_URL}${encodeURIComponent(party ?? "")}`,
    [PARTY_URL, party],
  );
  const partyUrl = useFinancialYearUrl(partyBaseUrl);
  const outstandingUrl = useFinancialYearUrl(OUTSTANDING_URL);
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [outstandingAmount, setOutstandingAmount] = useState(0);
  const [paymentTiming, setPaymentTiming] = useState({
    averagePaymentDays: null,
    paidInvoiceCount: 0,
  });
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Loading party details...");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setStatus("loading");
        setMessage("Loading party details...");

        const [partyResponse, outstandingResponse] = await Promise.all([
          fetch(partyUrl, fetchOptions),
          fetch(outstandingUrl, fetchOptions),
        ]);
        if (partyResponse.status === 404) {
          if (cancelled) return;
          setSummary(null);
          setTransactions([]);
          setOutstandingAmount(0);
          setPaymentTiming({
            averagePaymentDays: null,
            paidInvoiceCount: 0,
          });
          setStatus("empty");
          return;
        }
        if (!partyResponse.ok || !outstandingResponse.ok) {
          throw new Error("Unable to load party details");
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

        const nextTransactions = Array.isArray(data.data) ? data.data : [];
        const nextSummary = data.summary?.[0] ?? null;

        setTransactions(nextTransactions);
        setSummary(nextSummary);
        setOutstandingAmount(
          Number(
            partyOutstanding?.amountToCollect ?? partyOutstanding?.amountToPay,
          ) || 0,
        );
        setPaymentTiming(getAveragePaymentDays(outstandingData.data ?? [], party));
        setStatus(nextSummary === null ? "empty" : "success");
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
  }, [fetchOptions, outstandingUrl, party, partyUrl, reloadCount]);
  return {
    summary,
    transactions,
    outstandingAmount,
    ...paymentTiming,
    status,
    message,
    reload: () => setReloadCount((count) => count + 1),
  };
}
