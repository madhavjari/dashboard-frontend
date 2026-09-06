import {
  getNumericQuantityForUnit,
  getUnitKey,
  getUnitLabel,
} from "./unitOfMeasure";

export function formatInvoiceQuantity(items, fmtNumber) {
  if (!items?.length) return "—";

  const units = new Set(items.map((item) => getUnitKey(item.per)));
  const everyItemHasUnit = items.every(
    (item) => getUnitKey(item.per) !== null,
  );

  if (!everyItemHasUnit || units.size !== 1) return "Mixed units";

  const totalQuantity = items.reduce(
    (total, item) => total + getNumericQuantityForUnit(item),
    0,
  );
  const format =
    fmtNumber || ((value) => Number(value).toLocaleString("en-IN"));

  return `${format(totalQuantity, 1)} ${getUnitLabel(items[0]?.per)}`;
}
