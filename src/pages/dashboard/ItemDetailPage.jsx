import { useMemo } from "react";
import { useSearchParams } from "react-router";
import Error from "../../components/dashboard/Error";
import Loading from "../../components/dashboard/Loading";
import { fmtCompact, fmtINR } from "../../utils/format";
import useItemDetailData from "../../utils/fetch/itemDetailData";
import {
  getNumericQuantityForUnit,
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
  const summary = transactions.reduce(
    (summary, transaction) => {
      const isReturn = transaction.code.endsWith("R");
      const amount = toNumber(transaction.totalAmount);

      if (isReturn) {
        summary.returnAmount += amount;
        return summary;
      }

      summary.grossAmount += amount;
      summary.quantity += getNumericQuantityForUnit(transaction);
      summary.unit = getUnitLabel(transaction.per);
      return summary;
    },
    {
      grossAmount: 0,
      returnAmount: 0,
      netAmount: 0,
      quantity: 0,
      unit: getUnitLabel(transactions[0]?.per),
    },
  );

  return summary;
}

export default function ItemDetailPage({ ITEM_URL, context }) {
  const [searchParams] = useSearchParams();
  const item = searchParams.get("item");
  const { transactions, status, message, reload } = useItemDetailData(
    ITEM_URL,
    item,
  );
  const summary = useMemo(() => {
    const itemSummary = buildSummary(transactions);
    itemSummary.netAmount = itemSummary.grossAmount - itemSummary.returnAmount;
    return itemSummary;
  }, [transactions]);

  if (status === "loading") {
    return <Loading message={message} header="Item Summary" />;
  }

  if (status === "error") {
    return <Error message={message} header="Item Summary" reload={reload} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <ItemDetailHeader item={item} />
        <ItemDetailSummary
          summary={summary}
          fmtCompact={fmtCompact}
          fmtINR={fmtINR}
          fmtNumber={fmtNumber}
          context={context}
        />
        <PartyRevenueQuantityChart transactions={transactions} />
        <ItemTransactionRegister
          transactions={transactions}
          fmtNumber={fmtNumber}
          fmtINR={fmtINR}
        />
      </div>
    </div>
  );
}
