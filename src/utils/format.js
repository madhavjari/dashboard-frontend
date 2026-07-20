export const fmtINR = (n, decimals = 0) =>
  "₹" +
  Number(n || 0).toLocaleString("en-IN", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });

export const fmtCompact = (n) => {
  const num = Number(n) || 0;
  const abs = Math.abs(num);
  if (abs >= 1e7) return "₹" + (num / 1e7).toFixed(2) + "Cr";
  if (abs >= 1e5) return "₹" + (num / 1e5).toFixed(2) + "L";
  if (abs >= 1e3) return "₹" + (num / 1e3).toFixed(1) + "K";
  return "₹" + num;
};
