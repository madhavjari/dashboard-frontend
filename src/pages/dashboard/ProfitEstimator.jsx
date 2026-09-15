import { useMemo, useState } from "react";
import {
  Check,
  RotateCcw,
  Search,
  TrendingUp,
  X,
} from "lucide-react";
import { useOutletContext } from "react-router";
import Error from "../../components/dashboard/Error";
import Loading from "../../components/dashboard/Loading";
import { fmtCompact, fmtINR } from "../../utils/format";
import useProfitEstimatorData from "../../utils/fetch/profitEstimatorData";
import {
  getNumericQuantityForUnit,
  getUnitLabel,
  isMixedUnit,
} from "../../utils/unitOfMeasure";

function toNumber(value) {
  return Number(value) || 0;
}

function parseEnteredAmount(value) {
  if (String(value ?? "").trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function formatNumber(value, digits = 1) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: digits,
  }).format(value);
}

export default function ProfitEstimator({
  salesSummaryUrl,
  purchaseSummaryUrl,
  salesItemsUrl,
  view = "yearly",
}) {
  const { financialYear } = useOutletContext() ?? {};
  const { data, status, message, reload } = useProfitEstimatorData({
    salesSummaryUrl,
    purchaseSummaryUrl,
    salesItemsUrl,
  });
  if (status === "loading") {
    return <Loading header="Profit estimator" message={message} />;
  }

  if (status === "error") {
    return <Error header="Profit estimator" message={message} reload={reload} />;
  }

  return (
    <main className="app-page">
      <div className="app-page-inner">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-teal-700">Profit estimator</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              {view === "itemwise" ? "Itemwise estimate" : "Yearly estimate"}
            </h1>
            <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-600">
              {view === "itemwise"
                ? "Estimate item margins using average selling prices and your entered costs."
                : "Estimate this year’s profit using recorded totals and any unrecorded sales or purchases."}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200/70 px-3 py-1.5 text-xs font-semibold text-slate-600">
            <Check size={14} /> Session only · nothing saved
          </span>
        </header>

        {view === "yearly" ? (
          <YearEstimate
            recordedSales={data.recordedSales}
            recordedPurchases={data.recordedPurchases}
            financialYear={financialYear}
          />
        ) : (
          <ItemEstimate sourceItems={data.items} />
        )}
      </div>
    </main>
  );
}

function YearEstimate({ recordedSales, recordedPurchases, financialYear }) {
  const [unrecordedSales, setUnrecordedSales] = useState("");
  const [unrecordedPurchases, setUnrecordedPurchases] = useState("");
  const adjustedSales = recordedSales + toNumber(unrecordedSales);
  const adjustedPurchases = recordedPurchases + toNumber(unrecordedPurchases);
  const estimatedProfit = adjustedSales - adjustedPurchases;
  const margin = adjustedSales ? (estimatedProfit / adjustedSales) * 100 : 0;
  const hasAdditions = Boolean(unrecordedSales || unrecordedPurchases);

  return (
    <div
      id="year-profit-panel"
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]"
    >
      <section className="surface-card overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
          <h2 className="text-base font-bold text-slate-950">
            {financialYear || "Selected year"} estimate
          </h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Recorded figures exclude GST and returns. Add activity that has not
            reached the accounting software yet.
          </p>
        </div>

        <div className="grid border-b border-slate-200 bg-slate-50/70 sm:grid-cols-2">
          <RecordedValue
            label="Recorded net sales"
            value={recordedSales}
            detail="After returns · excluding GST"
          />
          <RecordedValue
            label="Recorded net purchases"
            value={recordedPurchases}
            detail="After returns · excluding GST"
          />
        </div>

        <div className="flex items-start justify-between gap-3 px-5 pt-5 sm:px-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Add unrecorded activity
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Leave either field blank when there is nothing more to add.
            </p>
          </div>
          {hasAdditions ? (
            <button
              type="button"
              onClick={() => {
                setUnrecordedSales("");
                setUnrecordedPurchases("");
              }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            >
              <RotateCcw size={13} /> Reset
            </button>
          ) : null}
        </div>
        <div className="grid gap-5 p-5 pt-4 sm:grid-cols-2 sm:p-6 sm:pt-4">
          <MoneyInput
            label="Unrecorded sales"
            value={unrecordedSales}
            onChange={setUnrecordedSales}
            helper="Sales for this year not yet recorded · excluding GST"
          />
          <MoneyInput
            label="Unrecorded purchases"
            value={unrecordedPurchases}
            onChange={setUnrecordedPurchases}
            helper="Purchases for this year not yet recorded · excluding GST"
          />
        </div>

        <div className="grid border-t border-slate-200 bg-teal-50/40 sm:grid-cols-2">
          <AdjustedValue label="Adjusted sales" value={adjustedSales} />
          <AdjustedValue label="Adjusted purchases" value={adjustedPurchases} />
        </div>
      </section>

      <EstimateResult
        title="Estimated profit"
        value={estimatedProfit}
        margin={margin}
        detail="Adjusted sales − adjusted purchases"
        className="xl:sticky xl:top-24 xl:self-start"
      />

      <p className="text-xs leading-5 text-slate-500 xl:col-span-2">
        This is a quick trading estimate. It does not account for opening or
        closing stock, wages, overheads, depreciation, other income, or income
        tax.
      </p>
    </div>
  );
}

function MoneyInput({ label, value, onChange, helper }) {
  return (
    <label className="block text-sm font-semibold text-slate-800">
      {label}
      <span className="relative mt-1.5 block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono-num text-sm text-slate-400">
          ₹
        </span>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="0.00"
          className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 font-mono-num text-sm text-slate-950 outline-none focus:border-teal-600 focus:ring-3 focus:ring-teal-100"
        />
      </span>
      <span className="mt-1.5 block text-xs font-normal leading-5 text-slate-500">
        {helper}
      </span>
    </label>
  );
}

function RecordedValue({ label, value, detail }) {
  return (
    <div className="border-b border-slate-200 px-5 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1.5 font-mono-num text-xl font-bold text-slate-950" title={fmtINR(value, 2)}>
        {fmtCompact(value)}
      </p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function AdjustedValue({ label, value }) {
  return (
    <div className="border-b border-teal-100 px-5 py-3.5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-teal-800">
        {label}
      </p>
      <p className="mt-1 font-mono-num text-base font-bold text-slate-950" title={fmtINR(value, 2)}>
        {fmtINR(value, 2)}
      </p>
    </div>
  );
}

function EstimateResult({
  title,
  value,
  margin,
  detail,
  hasEstimate = true,
  className = "",
  children,
}) {
  const positive = value >= 0;

  return (
    <aside className={`overflow-hidden rounded-2xl bg-[#0d1c1a] p-6 text-white shadow-sm ${className}`} aria-live="polite">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-teal-300">
        <TrendingUp size={20} />
      </div>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
        {title}
      </p>
      <p
        className={`mt-2 font-mono-num text-3xl font-bold tracking-tight ${
          positive ? "text-teal-300" : "text-rose-300"
        }`}
        title={fmtINR(value, 2)}
      >
        {hasEstimate ? fmtCompact(value) : "—"}
      </p>
      <p className="mt-2 text-sm font-semibold text-slate-200">
        {hasEstimate && margin !== null
          ? `${margin.toFixed(1)}% estimated margin`
          : "Enter costs to calculate"}
      </p>
      <p className="mt-1 text-xs leading-5 text-slate-400">{detail}</p>
      {children}
    </aside>
  );
}

function ItemEstimate({ sourceItems }) {
  const items = useMemo(
    () =>
      sourceItems
        .map((item) => {
          const mixed = isMixedUnit(item.per);
          const quantity = mixed ? null : getNumericQuantityForUnit(item);
          const hasTaxableAmount =
            item.taxableAmount !== undefined && item.taxableAmount !== null;
          const salesValue = hasTaxableAmount
            ? toNumber(item.taxableAmount)
            : null;
          const sellingPrice =
            quantity > 0 && salesValue !== null ? salesValue / quantity : null;
          return {
            name: item.itemName,
            uom: getUnitLabel(item.per),
            quantity,
            salesValue,
            sellingPrice,
            selectable: !mixed && quantity > 0 && salesValue !== null,
            selectionMessage: mixed
              ? "Mixed or unavailable quantity"
              : quantity <= 0
                ? "Quantity unavailable"
                : "Pre-GST total unavailable",
          };
        })
        .sort((first, second) => first.name.localeCompare(second.name)),
    [sourceItems],
  );
  const [selectedNames, setSelectedNames] = useState(() => new Set());
  const [costs, setCosts] = useState({});
  const [query, setQuery] = useState("");
  const [selectedOnly, setSelectedOnly] = useState(false);
  const normalizedQuery = query.trim().toLowerCase();
  const matchingItems = items.filter((item) =>
    `${item.name} ${item.uom}`.toLowerCase().includes(normalizedQuery),
  );
  const visibleItems = selectedOnly
    ? matchingItems.filter((item) => selectedNames.has(item.name))
    : matchingItems;
  const selectableMatches = matchingItems.filter((item) => item.selectable);
  const selectedItems = items.filter((item) => selectedNames.has(item.name));
  const completedItems = selectedItems.filter(
    (item) => parseEnteredAmount(costs[item.name]) !== null,
  );
  const estimatedSales = completedItems.reduce(
    (total, item) => total + item.salesValue,
    0,
  );
  const estimatedCost = completedItems.reduce(
    (total, item) =>
      total + item.quantity * parseEnteredAmount(costs[item.name]),
    0,
  );
  const estimatedProfit = estimatedSales - estimatedCost;
  const margin = estimatedSales ? (estimatedProfit / estimatedSales) * 100 : null;
  const incompleteCount = selectedItems.length - completedItems.length;

  function toggleItem(name) {
    setSelectedNames((current) => {
      const next = new Set(current);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function selectAll() {
    setSelectedNames((current) => {
      const next = new Set(current);
      selectableMatches.forEach((item) => next.add(item.name));
      return next;
    });
  }

  function resetEstimate() {
    setSelectedNames(new Set());
    setCosts({});
    setSelectedOnly(false);
  }

  return (
    <div
      id="item-profit-panel"
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]"
    >
      <section className="order-2 surface-card overflow-hidden xl:order-1">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-950">
                Estimate item margins
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Select one, several, or all items and enter the cost for each UOM.
              </p>
            </div>
            <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800">
              {selectedItems.length} selected
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="relative block min-w-0 flex-1">
              <span className="sr-only">Search item or UOM</span>
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search item or UOM"
                className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-8 text-sm outline-none focus:border-teal-600 focus:ring-3 focus:ring-teal-100"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              ) : null}
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600">
                <input
                  type="checkbox"
                  checked={selectedOnly}
                  onChange={(event) => setSelectedOnly(event.target.checked)}
                  className="peer sr-only"
                />
                <span className="relative h-5 w-9 rounded-full bg-slate-300 transition-colors duration-200 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:duration-200 after:content-[''] peer-checked:bg-teal-600 peer-checked:after:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-teal-600 peer-focus-visible:ring-offset-2" />
                Selected only
              </label>
              <button
                type="button"
                onClick={selectAll}
                disabled={!selectableMatches.length}
                className="h-10 rounded-lg border border-teal-200 bg-teal-50 px-3 text-xs font-semibold text-teal-800 hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {normalizedQuery
                  ? `Select ${selectableMatches.length} results`
                  : "Select all"}
              </button>
              <button
                type="button"
                onClick={resetEstimate}
                disabled={!selectedItems.length && !Object.keys(costs).length}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                <RotateCcw size={13} /> Reset
              </button>
            </div>
          </div>
        </div>

        <div className="max-h-[42rem] overflow-auto">
          {visibleItems.length ? (
            <div className="divide-y divide-slate-100">
              {visibleItems.map((item) => {
                const selected = selectedNames.has(item.name);
                const enteredCost = parseEnteredAmount(costs[item.name]);
                const itemProfit =
                  selected && enteredCost !== null && item.salesValue !== null
                    ? item.salesValue - item.quantity * enteredCost
                    : null;

                return (
                  <div
                    key={item.name}
                    className={`p-4 transition sm:px-6 ${
                      selected
                        ? "bg-teal-50/40"
                        : item.selectable
                          ? "bg-white"
                          : "bg-slate-50/60"
                    }`}
                  >
                    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_7rem_9rem_11rem] md:items-center">
                      <label
                        className={`flex min-w-0 items-start gap-3 ${
                          item.selectable ? "cursor-pointer" : "cursor-not-allowed"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          disabled={!item.selectable}
                          onChange={() => toggleItem(item.name)}
                          className="mt-0.5 size-4 shrink-0 accent-teal-700"
                        />
                        <span className="min-w-0">
                          <span className="block break-words text-sm font-bold text-slate-950">
                            {item.name}
                          </span>
                          <span className="mt-1 block text-xs text-slate-500">
                            {item.selectable
                              ? `${formatNumber(item.quantity, 2)} ${item.uom} sold`
                              : item.selectionMessage}
                          </span>
                        </span>
                      </label>

                      <ItemValue
                        label="Avg. selling (ex GST)"
                        value={
                          item.sellingPrice === null
                            ? "—"
                            : `${fmtINR(item.sellingPrice, 2)}/${item.uom}`
                        }
                      />
                      <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Cost / {item.uom} · ex GST
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.01"
                          disabled={!item.selectable}
                          value={costs[item.name] ?? ""}
                          onChange={(event) => {
                            setCosts((current) => ({
                              ...current,
                              [item.name]: event.target.value,
                            }));
                            setSelectedNames((current) => {
                              const next = new Set(current);
                              next.add(item.name);
                              return next;
                            });
                          }}
                          placeholder="0.00"
                          className="mt-1 h-9 w-full rounded-lg border border-slate-300 bg-white px-2.5 font-mono-num text-sm font-medium text-slate-950 outline-none focus:border-teal-600 focus:ring-3 focus:ring-teal-100 disabled:bg-slate-100 disabled:text-slate-400"
                        />
                      </label>
                      <ItemValue
                        label="Estimated profit"
                        value={itemProfit === null ? "—" : fmtINR(itemProfit, 2)}
                        detail={
                          itemProfit === null
                            ? undefined
                            : `${fmtINR(item.sellingPrice - enteredCost, 2)}/${item.uom}`
                        }
                        tone={
                          itemProfit === null
                            ? "text-slate-400"
                            : itemProfit >= 0
                              ? "text-teal-700"
                              : "text-rose-700"
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-5 py-12 text-center">
              <p className="text-sm font-semibold text-slate-800">
                {selectedOnly ? "No selected items" : "No items match your search"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {selectedOnly
                  ? "Select items first, or turn off Selected only."
                  : "Try a broader item name or UOM."}
              </p>
            </div>
          )}
        </div>
      </section>

      <EstimateResult
        title={incompleteCount ? "Current item profit" : "Estimated item profit"}
        value={estimatedProfit}
        margin={margin}
        detail={`${completedItems.length} of ${selectedItems.length} selected items calculated`}
        hasEstimate={completedItems.length > 0}
        className="order-1 xl:order-2 xl:sticky xl:top-24 xl:self-start"
      >
        <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-xs">
          <ResultLine label="Sales · ex GST" value={fmtINR(estimatedSales, 2)} />
          <ResultLine label="Cost · ex GST" value={fmtINR(estimatedCost, 2)} />
        </div>
        {incompleteCount ? (
          <p className="mt-4 rounded-lg bg-amber-300/10 px-3 py-2 text-xs leading-5 text-amber-200">
            Enter cost for {incompleteCount} selected {incompleteCount === 1 ? "item" : "items"} to complete the estimate.
          </p>
        ) : null}
        {!selectedItems.length ? (
          <p className="mt-4 text-xs leading-5 text-slate-400">
            Select an item to begin.
          </p>
        ) : null}
      </EstimateResult>

      <div className="order-3 flex items-start gap-2 text-xs leading-5 text-slate-500 xl:col-span-2">
        <Check size={15} className="mt-0.5 shrink-0 text-teal-700" />
        <p>
          Profit is (average selling price excluding GST − cost per UOM
          excluding GST) × quantity sold. Enter cost before GST for a
          like-for-like estimate. Nothing entered here is saved.
        </p>
      </div>
    </div>
  );
}

function ItemValue({ label, value, detail, tone = "text-slate-800" }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className={`mt-1 font-mono-num text-sm font-bold ${tone}`}>{value}</p>
      {detail ? (
        <p className="mt-0.5 font-mono-num text-[10px] text-slate-500">
          {detail}
        </p>
      ) : null}
    </div>
  );
}

function ResultLine({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 text-slate-300">
      <span>{label}</span>
      <span className="font-mono-num font-semibold text-white">{value}</span>
    </div>
  );
}
