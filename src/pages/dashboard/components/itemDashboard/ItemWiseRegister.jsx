import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  ArrowUpRight,
  PackageSearch,
  Search,
  TrendingUp,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { fmtCompact } from "../../../../utils/format";
import RegisterPagination, {
  REGISTER_PAGE_SIZE,
} from "../RegisterPagination";

export default function ItemWiseRegister({
  columns,
  context,
  sortedItems,
  sortKey,
  handleSort,
  summary,
  fmtNumber,
  fmtINR,
}) {
  const { pathname } = useLocation();
  const routePrefix = pathname.startsWith("/demo/") ? "/demo" : "";
  const detailRoute = context === "Sales" ? "item" : "purchase-item";
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized
      ? sortedItems.filter((item) =>
          `${item.name} ${item.category}`.toLowerCase().includes(normalized),
        )
      : sortedItems;
  }, [query, sortedItems]);

  const highlights = useMemo(() => {
    const totalValue = sortedItems.reduce(
      (total, item) => total + (Number(item.transaction) || 0),
      0,
    );
    const topItem = sortedItems.reduce(
      (top, item) =>
        !top || Number(item.transaction) > Number(top.transaction) ? item : top,
      null,
    );
    const topShare =
      topItem && totalValue
        ? (Number(topItem.transaction) / totalValue) * 100
        : 0;

    return {
      totalValue,
      topItem,
      topShare,
      averageValue: sortedItems.length ? totalValue / sortedItems.length : 0,
    };
  }, [sortedItems]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / REGISTER_PAGE_SIZE),
  );
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * REGISTER_PAGE_SIZE;
  const visibleItems = filteredItems.slice(
    startIndex,
    startIndex + REGISTER_PAGE_SIZE,
  );
  const itemUrl = (name) =>
    `${routePrefix}/${detailRoute}?item=${encodeURIComponent(name)}`;
  const totalTransaction = Number(summary.totalTransaction) || 0;
  const itemShare = (item) =>
    totalTransaction ? (Number(item.transaction) / totalTransaction) * 100 : 0;

  return (
    <section className="surface-card overflow-hidden">
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold text-slate-950">Item register</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
              {sortedItems.length} {sortedItems.length === 1 ? "item" : "items"}
            </span>
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Compare item value, quantity, and contribution, then open an item ledger for detail.
          </p>
        </div>

        <div
          className="mt-4 grid overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70 sm:grid-cols-3"
          aria-label="Item performance highlights"
        >
          <Highlight
            label={`Total ${context.toLowerCase()} value`}
            value={fmtCompact(highlights.totalValue)}
            exactValue={fmtINR(highlights.totalValue)}
            tone="text-teal-700"
            icon={TrendingUp}
          />
          <Highlight
            label="Top item contribution"
            value={`${highlights.topShare.toFixed(1)}%`}
            detail={highlights.topItem?.name || "No item activity"}
            tone="text-teal-700"
            icon={PackageSearch}
          />
          <Highlight
            label="Average value per item"
            value={fmtCompact(highlights.averageValue)}
            exactValue={fmtINR(highlights.averageValue)}
            detail="across the complete register"
            tone="text-slate-800"
          />
        </div>

        <label className="relative mt-4 block w-full sm:ml-auto sm:w-72">
          <span className="sr-only">Search item or unit</span>
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search item or unit"
            className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-8 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-3 focus:ring-teal-100"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          ) : null}
        </label>
      </div>

      {filteredItems.length ? (
        <RegisterPagination
          page={activePage}
          totalPages={totalPages}
          startIndex={startIndex}
          visibleCount={visibleItems.length}
          totalCount={filteredItems.length}
          itemLabel="items"
          onChange={setCurrentPage}
          scrollTargetId="item-register"
          placement="top"
        />
      ) : null}

      <div
        id="item-register"
        className="scroll-mt-12 space-y-3 p-4 md:hidden"
      >
        {visibleItems.length ? (
          visibleItems.map((item, index) => (
            <article
              key={item.name}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgb(15_23_42/0.03)]"
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3.5">
                <div className="flex min-w-0 items-start gap-3">
                  <Rank value={startIndex + index + 1} />
                  <div className="min-w-0">
                    <Link
                      to={itemUrl(item.name)}
                      className="block break-words text-sm font-bold text-slate-950 hover:text-teal-700"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.category} · {item.quantity === null ? "Mixed quantity" : `${fmtNumber(item.quantity, 1)} moved`}
                    </p>
                  </div>
                </div>
                <Link
                  to={itemUrl(item.name)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-teal-50 hover:text-teal-700"
                  aria-label={`Open ${item.name} ledger`}
                >
                  <ArrowUpRight size={17} />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 px-4 py-4 text-xs">
                <Value
                  label={`${context} value`}
                  value={fmtINR(item.transaction)}
                  tone="text-teal-700"
                  strong
                />
                <Value
                  label={`Share of ${context.toLowerCase()}`}
                  value={`${itemShare(item).toFixed(1)}%`}
                  tone="text-slate-950"
                  strong
                />
                <Value
                  label="Quantity"
                  value={
                    item.quantity === null
                      ? "—"
                      : `${fmtNumber(item.quantity, 1)} ${item.category}`
                  }
                />
                <Value
                  label="Net rate (inc. GST)"
                  value={
                    item.quantity > 0
                      ? fmtINR(item.transaction / item.quantity, 2)
                      : "—"
                  }
                />
              </div>
            </article>
          ))
        ) : (
          <Empty query={query} />
        )}
      </div>

      <div className="table-scroll hidden max-h-[42rem] overflow-auto md:block">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50">
            <tr className="border-b border-slate-200 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">
              <th className="w-14 px-5 py-3 text-center">#</th>
              {columns.map(([key, label]) => (
                <th
                  key={key}
                  className={`px-4 py-3 ${key === "quantity" || key === "transaction" ? "text-right" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => handleSort(key)}
                    className="inline-flex min-h-8 items-center gap-1 rounded px-1 font-semibold hover:text-slate-800"
                    aria-label={`Sort by ${label}`}
                  >
                    {label}
                    <ArrowUpDown
                      size={11}
                      className={sortKey === key ? "text-teal-700 opacity-100" : "opacity-30"}
                    />
                  </button>
                </th>
              ))}
              <th className="px-4 py-3 text-right">Share</th>
              <th className="px-4 py-3 text-right">Net rate (inc. GST)</th>
              <th className="w-12 px-3 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleItems.length ? (
              visibleItems.map((item, index) => {
                const share = itemShare(item);
                return (
                  <tr
                    key={item.name}
                    className="border-b border-slate-100 transition-colors hover:bg-teal-50/40"
                  >
                    <td className="px-5 py-3.5 text-center">
                      <Rank value={startIndex + index + 1} />
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-950">
                      <Link
                        to={itemUrl(item.name)}
                        className="hover:text-teal-700 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono-num text-slate-600">
                      {item.quantity === null ? "—" : fmtNumber(item.quantity, 1)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono-num font-bold text-teal-700">
                      {fmtINR(item.transaction)}
                    </td>
                    <td className="px-4 py-3.5">
                      <ShareValue value={share} />
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono-num text-slate-600">
                      {item.quantity > 0
                        ? fmtINR(item.transaction / item.quantity, 2)
                        : "—"}
                    </td>
                    <td className="px-3 py-3.5">
                      <Link
                        to={itemUrl(item.name)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-teal-700"
                        aria-label={`Open ${item.name} ledger`}
                        title="Open item ledger"
                      >
                        <ArrowUpRight size={17} />
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8">
                  <Empty query={query} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredItems.length ? (
        <RegisterPagination
          page={activePage}
          totalPages={totalPages}
          startIndex={startIndex}
          visibleCount={visibleItems.length}
          totalCount={filteredItems.length}
          itemLabel="items"
          onChange={setCurrentPage}
          scrollTargetId="item-register"
        />
      ) : null}
    </section>
  );
}

function Highlight({ label, value, exactValue, detail, tone, icon: Icon }) {
  return (
    <div className="border-b border-slate-200 px-4 py-3.5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">
        {Icon ? <Icon size={14} className="text-slate-400" /> : null}
        <span>{label}</span>
      </div>
      <p
        className={`mt-1.5 font-mono-num text-lg font-bold tracking-tight ${tone}`}
        title={exactValue}
      >
        {value}
      </p>
      {detail ? (
        <p className="mt-0.5 truncate text-[11px] text-slate-500" title={detail}>
          {detail}
        </p>
      ) : null}
    </div>
  );
}

function Rank({ value }) {
  return (
    <span
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono-num text-xs font-bold ${
        value <= 3
          ? "bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-200"
          : "text-slate-400"
      }`}
    >
      {value}
    </span>
  );
}

function ShareValue({ value }) {
  const width = Math.min(100, Math.max(0, Math.abs(value)));
  return (
    <div className="ml-auto grid w-28 grid-cols-[1fr_3rem] items-center gap-2">
      <span className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <span
          className="block h-full rounded-full bg-teal-600"
          style={{ width: `${width}%` }}
        />
      </span>
      <span className="text-right font-mono-num text-xs font-semibold text-slate-700">
        {value.toFixed(1)}%
      </span>
    </div>
  );
}

function Value({ label, value, strong = false, tone = "text-slate-700" }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-400">
        {label}
      </p>
      <p
        className={`mt-1 font-mono-num ${strong ? "font-bold" : "font-medium"} ${tone}`}
      >
        {value}
      </p>
    </div>
  );
}

function Empty({ query }) {
  return (
    <div className="px-5 py-12 text-center">
      <p className="text-sm font-semibold text-slate-800">
        {query ? "No items match your search" : "No item performance yet"}
      </p>
      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
        {query
          ? "Try a broader item name or unit."
          : "There is no item activity for the selected workspace and financial year."}
      </p>
    </div>
  );
}
