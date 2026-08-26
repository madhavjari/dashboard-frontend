import { useMemo } from "react";
import { useOutletContext } from "react-router";

export function appendFinancialYear(url, financialYear) {
  if (!url || !financialYear) return url;

  const reportUrl = new URL(url);
  reportUrl.searchParams.set("financialYear", financialYear);
  return reportUrl.toString();
}

export default function useFinancialYearUrl(url) {
  const { financialYear } = useOutletContext() ?? {};

  return useMemo(
    () => appendFinancialYear(url, financialYear),
    [financialYear, url],
  );
}
