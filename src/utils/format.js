export const fmtINR = (n, decimals = 0) => {
  const value = Number(n) || 0;
  const sign = value < 0 ? "−" : "";
  return sign + "₹" + Math.abs(value).toLocaleString("en-IN", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
};

export const fmtCompact = (n) => {
  const num = Number(n) || 0;
  const abs = Math.abs(num);
  const sign = num < 0 ? "−" : "";
  if (abs >= 1e7) return sign + "₹" + (abs / 1e7).toFixed(2) + "Cr";
  if (abs >= 1e5) return sign + "₹" + (abs / 1e5).toFixed(2) + "L";
  if (abs >= 1e3) return sign + "₹" + (abs / 1e3).toFixed(1) + "K";
  return sign + "₹" + abs.toLocaleString("en-IN", { maximumFractionDigits: 1 });
};

export const fmtDateIN = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};
