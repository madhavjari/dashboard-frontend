import { useMemo } from "react";
import { useOutletContext } from "react-router";

export function appendFinancialYear(url, financialYear) {
  return appendReportFilters(url, financialYear);
}

export function appendReportFilters(
  url,
  financialYear,
  accountingCompanyIds = [],
) {
  if (!url) return url;

  const reportUrl = new URL(url);
  if (financialYear) {
    reportUrl.searchParams.set("financialYear", financialYear);
  }
  if (accountingCompanyIds.length) {
    reportUrl.searchParams.set(
      "accountingCompanyIds",
      accountingCompanyIds.join(","),
    );
  } else {
    reportUrl.searchParams.delete("accountingCompanyIds");
  }
  return reportUrl.toString();
}

export default function useFinancialYearUrl(url) {
  const { financialYear, selectedAccountingCompanyIds = [] } =
    useOutletContext() ?? {};

  return useMemo(
    () => appendReportFilters(url, financialYear, selectedAccountingCompanyIds),
    [financialYear, selectedAccountingCompanyIds, url],
  );
}
