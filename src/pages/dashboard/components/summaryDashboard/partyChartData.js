function toNumber(value) {
  return Number(value) || 0;
}

function getMedian(values) {
  const sorted = [...values].sort((first, second) => first - second);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

export function truncatePartyName(party, maxLength = 18) {
  return party.length > maxLength ? `${party.slice(0, maxLength)}…` : party;
}

export function preparePartyChartData(
  rows,
  primaryField,
  { regularLimit = 8, skewedLimit = 5 } = {},
) {
  const sortedRows = rows
    .filter((row) => Math.abs(toNumber(row[primaryField])) > 0)
    .sort(
      (first, second) =>
        Math.abs(toNumber(second[primaryField])) -
        Math.abs(toNumber(first[primaryField])),
    );

  const values = sortedRows
    .map((row) => Math.abs(toNumber(row[primaryField])))
    .filter(Boolean);
  const largestValue = values[0] || 0;
  const medianValue = values.length ? getMedian(values) : 0;
  const isSkewed = medianValue > 0 && largestValue / medianValue >= 5;
  const visibleLimit = isSkewed ? skewedLimit : regularLimit;

  if (sortedRows.length <= visibleLimit) {
    return { data: sortedRows, isSkewed, hiddenPartyCount: 0, visibleLimit };
  }

  const visibleRows = sortedRows.slice(0, visibleLimit);
  const hiddenRows = sortedRows.slice(visibleLimit);
  const otherParties = hiddenRows.reduce(
    (totals, row) => ({
      party: "Other parties",
      grossAmount: totals.grossAmount + toNumber(row.grossAmount),
      returnAmount: totals.returnAmount + toNumber(row.returnAmount),
      netAmount: totals.netAmount + toNumber(row.netAmount),
      invoiceCount: totals.invoiceCount + toNumber(row.invoiceCount),
    }),
    {
      party: "Other parties",
      grossAmount: 0,
      returnAmount: 0,
      netAmount: 0,
      invoiceCount: 0,
    },
  );

  otherParties.returnRate = otherParties.grossAmount
    ? +((otherParties.returnAmount / otherParties.grossAmount) * 100).toFixed(1)
    : 0;

  return {
    data: [...visibleRows, otherParties],
    isSkewed,
    hiddenPartyCount: hiddenRows.length,
    visibleLimit,
  };
}
