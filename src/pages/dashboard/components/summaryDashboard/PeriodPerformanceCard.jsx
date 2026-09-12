import { useEffect, useMemo, useState } from "react";
import { CalendarRange, ChevronDown, RefreshCw } from "lucide-react";
import { useOutletContext } from "react-router";
import { fmtCompact, fmtDateIN, fmtINR } from "../../../../utils/format";
import useAuthFetchOptions from "../../../../utils/fetch/authFetchOptions";
import { appendReportFilters } from "../../../../utils/fetch/reportUrl";

function getFinancialYearBounds(financialYear) {
  const [fromYear, toYear] = String(financialYear).split("-").map(Number);
  return {
    min: `${fromYear}-04-01`,
    max: `${toYear}-03-31`,
  };
}

function getLocalDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function PeriodPerformanceCard({ context, summaryUrl }) {
  const {
    financialYear,
    selectedAccountingCompanyIds = [],
  } = useOutletContext() ?? {};
  const fetchOptions = useAuthFetchOptions();
  const bounds = useMemo(
    () => getFinancialYearBounds(financialYear),
    [financialYear],
  );
  const initialToDate = useMemo(() => {
    const today = getLocalDate();
    return today < bounds.min ? bounds.min : today > bounds.max ? bounds.max : today;
  }, [bounds]);
  const [draftFromDate, setDraftFromDate] = useState(bounds.min);
  const [draftToDate, setDraftToDate] = useState(initialToDate);
  const [range, setRange] = useState({
    fromDate: bounds.min,
    toDate: initialToDate,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const isSales = context === "Sales";
  const reportLabel = isSales ? "Sales" : "Purchases";

  const requestUrl = useMemo(() => {
    const url = new URL(
      appendReportFilters(
        summaryUrl,
        financialYear,
        selectedAccountingCompanyIds,
      ),
    );
    url.searchParams.set("fromDate", range.fromDate);
    url.searchParams.set("toDate", range.toDate);
    return url.toString();
  }, [financialYear, range, selectedAccountingCompanyIds, summaryUrl]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const controller = new AbortController();

    async function loadPeriodPerformance() {
      try {
        setStatus("loading");
        setMessage("");
        setResult(null);
        const response = await fetch(requestUrl, {
          ...fetchOptions,
          signal: controller.signal,
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(
            payload?.errors
              ? Object.values(payload.errors).flat().join(" ")
              : `Unable to load ${reportLabel.toLowerCase()} for this period`,
          );
        }

        setResult(payload.data ?? payload);
        setStatus("success");
      } catch (error) {
        if (error.name === "AbortError") return;
        setMessage(error.message || "Unable to load this period");
        setStatus("error");
      }
    }

    loadPeriodPerformance();
    return () => controller.abort();
  }, [fetchOptions, isOpen, reportLabel, requestUrl]);

  const rangeIsValid =
    draftFromDate >= bounds.min &&
    draftToDate <= bounds.max &&
    draftFromDate <= draftToDate;

  function applyRange(event) {
    event.preventDefault();
    if (!rangeIsValid) return;
    setRange({ fromDate: draftFromDate, toDate: draftToDate });
  }

  return (
    <details
      className="surface-card group mb-6 overflow-hidden"
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 marker:hidden hover:bg-slate-50 sm:px-6 [&::-webkit-details-marker]:hidden">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
          <CalendarRange size={18} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold text-slate-950">
            View a custom {reportLabel.toLowerCase()} period
          </span>
          <span className="mt-0.5 block text-xs text-slate-500">
            Compare gross, returns, and net value between two dates.
          </span>
        </span>
        <span className="ml-auto flex shrink-0 items-center gap-2">
          {status === "loading" ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500" role="status">
              <RefreshCw size={14} className="animate-spin" /> Updating
            </span>
          ) : null}
          <ChevronDown
            size={18}
            className="text-slate-400 transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </span>
      </summary>

      <div className="border-t border-slate-200 px-5 py-5 sm:px-6">
        <form
          onSubmit={applyRange}
          className="grid gap-3 sm:grid-cols-[minmax(10rem,1fr)_minmax(10rem,1fr)_auto]"
        >
          <DateField
            id={`${context.toLowerCase()}-period-from`}
            label="Start date"
            value={draftFromDate}
            min={bounds.min}
            max={draftToDate || bounds.max}
            onChange={setDraftFromDate}
          />
          <DateField
            id={`${context.toLowerCase()}-period-to`}
            label="End date"
            value={draftToDate}
            min={draftFromDate || bounds.min}
            max={bounds.max}
            onChange={setDraftToDate}
          />
          <button
            type="submit"
            disabled={!rangeIsValid || status === "loading"}
            className="h-11 self-end rounded-lg bg-teal-700 px-5 text-sm font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            View report
          </button>
        </form>
      </div>

      {status === "error" ? (
        <div className="px-5 py-8 text-center" role="alert">
          <p className="text-sm font-semibold text-rose-700">Couldn’t load this period</p>
          <p className="mt-1 text-xs text-slate-500">{message}</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1.25fr_2fr]" aria-live="polite" aria-busy={status === "loading"}>
          <div className="bg-teal-950 px-5 py-5 text-white sm:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-teal-200">
              Net {reportLabel.toLowerCase()}
            </p>
            <p className="mt-2 font-mono-num text-3xl font-bold tracking-tight" title={result ? fmtINR(result.netAmount) : undefined}>
              {result ? fmtCompact(result.netAmount) : "—"}
            </p>
            <p className="mt-2 text-xs text-teal-100/75">
              {fmtDateIN(range.fromDate)} – {fmtDateIN(range.toDate)}
            </p>
          </div>
          <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-3 sm:divide-y-0">
            <Metric
              label={`Gross ${reportLabel.toLowerCase()}`}
              value={result ? fmtCompact(result.grossAmount) : "—"}
              exactValue={result ? fmtINR(result.grossAmount) : undefined}
            />
            <Metric
              label="Returns"
              value={result ? fmtCompact(result.returns) : "—"}
              exactValue={result ? fmtINR(result.returns) : undefined}
              tone="text-rose-700"
            />
            <Metric
              label="Invoices"
              value={result ? result.invoiceCount : "—"}
              detail={
                result
                  ? `${result.returnCount} ${Number(result.returnCount) === 1 ? "return" : "returns"}`
                  : undefined
              }
              className="col-span-2 sm:col-span-1"
            />
          </div>
        </div>
      )}
    </details>
  );
}

function DateField({ id, label, value, min, max, onChange }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">
        {label}
      </span>
      <input
        id={id}
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
        required
        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-teal-600 focus:ring-3 focus:ring-teal-100"
      />
    </label>
  );
}

function Metric({ label, value, exactValue, detail, tone = "text-slate-950", className = "" }) {
  return (
    <div className={`min-w-0 px-4 py-5 sm:px-5 ${className}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">
        {label}
      </p>
      <p
        className={`mt-2 font-mono-num text-xl font-bold tracking-tight ${tone}`}
        title={exactValue}
      >
        {value}
      </p>
      {detail ? <p className="mt-1 text-xs text-slate-500">{detail}</p> : null}
    </div>
  );
}
