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

function getDateStartTime(value) {
  if (!value) return Number.NaN;

  const dateOnly = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dateOnly) {
    return Date.UTC(
      Number(dateOnly[1]),
      Number(dateOnly[2]) - 1,
      Number(dateOnly[3]),
    );
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return Number.NaN;

  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function getInvoicePaymentDays(billDate, payments = []) {
  const billTime = getDateStartTime(billDate);
  if (Number.isNaN(billTime)) return null;

  const latestPaymentTime = payments.reduce((latest, payment) => {
    const paymentTime = getDateStartTime(
      payment.clearingDate || payment.chequeDate || payment.paymentDate,
    );
    return Number.isNaN(paymentTime) ? latest : Math.max(latest, paymentTime);
  }, Number.NEGATIVE_INFINITY);

  if (!Number.isFinite(latestPaymentTime)) return null;

  return Math.max(0, Math.round((latestPaymentTime - billTime) / 86_400_000));
}

export function getAgeBand(days) {
  if (days <= 30) return "0–30 days";
  if (days <= 60) return "31–60 days";
  if (days <= 90) return "61–90 days";
  return "90+ days";
}
