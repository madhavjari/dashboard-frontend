export function getInvoiceAgeDays(value) {
  const date =
    typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? new Date(`${value}T00:00:00`)
      : new Date(value);
  if (Number.isNaN(date.getTime())) return 0;

  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const billDateStart = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  return Math.max(
    0,
    Math.round((todayStart.getTime() - billDateStart.getTime()) / 86_400_000),
  );
}

export function getAgeBand(days) {
  if (days <= 30) return "0–30 days";
  if (days <= 60) return "31–60 days";
  if (days <= 90) return "61–90 days";
  return "90+ days";
}
