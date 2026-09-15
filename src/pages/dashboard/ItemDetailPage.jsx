import { useMemo } from "react";
import { useSearchParams } from "react-router";
import Error from "../../components/dashboard/Error";
import Loading from "../../components/dashboard/Loading";
import { fmtCompact, fmtINR } from "../../utils/format";
import useItemDetailData from "../../utils/fetch/itemDetailData";
import {
  getNumericQuantityForUnit,
  getUnitKey,
  getUnitLabel,
} from "../../utils/unitOfMeasure";
import ItemDetailHeader from "./components/itemDetail/ItemDetailHeader";
import ItemDetailSummary from "./components/itemDetail/ItemDetailSummary";
import ItemTransactionRegister from "./components/itemDetail/ItemTransactionRegister";
import PartyRevenueQuantityChart from "./components/itemDetail/PartyRevenueQuantityChart";

function toNumber(value) {
  return Number(value) || 0;
}

function fmtNumber(number, digits = 0) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: digits,
  }).format(number);
}

function buildSummary(transactions) {
  const units = new Set(
    transactions
      .map((transaction) => getUnitKey(transaction.per))
      .filter((unit) => unit !== null),
  );
  const hasMixedUnits = units.size > 1;
  const summary = transactions.reduce(
    (summary, transaction) => {
      const isReturn = transaction.code.endsWith("R");
      const amount = toNumber(transaction.totalAmount);
      const hasTaxableAmount =
        transaction.taxableAmount !== null &&
        transaction.taxableAmount !== undefined;

      if (isReturn) {
        summary.returnAmount += amount;
        return summary;
      }

      summary.grossAmount += amount;
      summary.grossTaxableAmount =
        summary.grossTaxableAmount !== null && hasTaxableAmount
          ? summary.grossTaxableAmount + toNumber(transaction.taxableAmount)
          : null;
      if (!hasMixedUnits) {
        summary.quantity += getNumericQuantityForUnit(transaction);
        summary.unit = getUnitLabel(transaction.per);
      }
      return summary;
    },
    {
      grossAmount: 0,
      grossTaxableAmount: 0,
      returnAmount: 0,
      netAmount: 0,
      quantity: 0,
      pricePerUnit: null,
      unit: hasMixedUnits
        ? "Mixed units"
        : getUnitLabel(transactions[0]?.per),
    },
  );

  return summary;
}

export default function ItemDetailPage({ ITEM_URL, OUTSTANDING_URL, context }) {
  const [searchParams] = useSearchParams();
  const item = searchParams.get("item");
  const { transactions, status, message, reload } = useItemDetailData(
    ITEM_URL,
    item,
    OUTSTANDING_URL,
  );
  const summary = useMemo(() => {
    const itemSummary = buildSummary(transactions);
    itemSummary.netAmount = itemSummary.grossAmount - itemSummary.returnAmount;
    itemSummary.pricePerUnit =
      itemSummary.quantity && itemSummary.grossTaxableAmount !== null
        ? itemSummary.grossTaxableAmount / itemSummary.quantity
        : null;
    return itemSummary;
  }, [transactions]);

  if (status === "loading") {
    return <Loading message={message} header="Item Summary" />;
  }

  if (status === "error") {
    return <Error message={message} header="Item Summary" reload={reload} />;
  }

  return (
    <main className="app-page">
      <div className="app-page-inner">
        <ItemDetailHeader item={item} context={context} />
        <ItemDetailSummary
          summary={summary}
          fmtCompact={fmtCompact}
          fmtINR={fmtINR}
          fmtNumber={fmtNumber}
          context={context}
        />
        <PartyRevenueQuantityChart transactions={transactions} context={context} />
        <ItemTransactionRegister
          transactions={transactions}
          fmtNumber={fmtNumber}
          fmtINR={fmtINR}
        />
      </div>
    </main>
  );
}
