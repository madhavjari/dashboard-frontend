import { useMemo, useState } from "react";
import Error from "../../components/dashboard/Error";
import Loading from "../../components/dashboard/Loading";
import useItemData from "../../utils/fetch/itemData";
import { fmtCompact, fmtINR } from "../../utils/format";
import {
  getNumericQuantityForUnit,
  getUnitLabel,
} from "../../utils/unitOfMeasure";
import ItemDashboardHeader from "./components/itemDashboard/ItemDashboardHeader";
import ItemDashboardSummary from "./components/itemDashboard/ItemDashboardSummary";
import ItemWiseRegister from "./components/itemDashboard/ItemWiseRegister";
import TransactionByItemChart from "./components/itemDashboard/TransactionByItemChart";

function toNum(value) {
  const number = parseFloat(value);
  return Number.isNaN(number) ? 0 : number;
}

function fmtNumber(number, digits = 0) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: digits,
  }).format(number);
}

export default function ItemDashboard({ ITEMS_URL, context }) {
  const { summary, topItems, message, reload, status } = useItemData(ITEMS_URL);
  const [sortKey, setSortKey] = useState("revenue");
  const [sortDir, setSortDir] = useState("desc");

  const items = useMemo(
    () =>
      topItems.map((item) => {
        const transaction = toNum(item.transaction);
        const per = item.per || "p";
        const quantity = getNumericQuantityForUnit(item);
        const category = getUnitLabel(per);

        return {
          name: item.itemName,
          transaction,
          per,
          quantity,
          category,
        };
      }),
    [topItems],
  );

  const sortedItems = useMemo(() => {
    const sorted = [...items];
    sorted.sort((a, b) => {
      const first = a[sortKey];
      const second = b[sortKey];
      if (typeof first === "string") {
        return sortDir === "asc"
          ? first.localeCompare(second)
          : second.localeCompare(first);
      }
      return sortDir === "asc" ? first - second : second - first;
    });
    return sorted;
  }, [items, sortDir, sortKey]);

  if (status === "loading") {
    return <Loading message={message} header="Item Dashboard" />;
  }

  if (status === "error") {
    return <Error message={message} header="Item Dashboard" reload={reload} />;
  }

  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const rankedItems = [...items].sort((a, b) => b.transaction - a.transaction);
  const topTenItems = rankedItems.slice(0, 10);
  const remainingItems = rankedItems.slice(10);
  const barData = topTenItems
    .map((item) => ({
      name:
        item.name.length > 30 ? `${item.name.slice(0, 30)}…` : item.name,
      fullName: item.name,
      transaction: item.transaction,
    }))
    .concat(
      remainingItems.length
        ? {
            name: "Other items",
            fullName: `${remainingItems.length} other items`,
            transaction: remainingItems.reduce(
              (total, item) => total + item.transaction,
              0,
            ),
          }
        : [],
    );
  const columns = [
    ["name", "Item"],
    ["category", "UOM"],
    ["quantity", "Qty"],
    ["transaction", "Transaction"],
  ];

  function handleSort(key) {
    if (key === sortKey) {
      setSortDir((direction) => (direction === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir("desc");
  }

  return (
    <main className="app-page">
      <div className="app-page-inner">
        <ItemDashboardHeader
          context={context}
          totalItems={summary.totalUniqueItems}
          totalQuantity={fmtNumber(totalQuantity)}
        />
        <ItemDashboardSummary
          context={context}
          summary={summary}
          fmtCompact={fmtCompact}
          fmtINR={fmtINR}
        />
        <div className="mb-6">
          <TransactionByItemChart
            barData={barData}
            fmtCompact={fmtCompact}
            fmtINR={fmtINR}
            context={context}
          />
        </div>
        <ItemWiseRegister
          columns={columns}
          context={context}
          sortedItems={sortedItems}
          sortKey={sortKey}
          handleSort={handleSort}
          summary={summary}
          fmtNumber={fmtNumber}
          fmtINR={fmtINR}
        />
      </div>
    </main>
  );
}
