export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5000/api/v1"
    : "https://dashboard-backend-0n54.onrender.com/api/v1")
).replace(/\/+$/, "");

export const AUTH_BASE_URL = `${API_BASE_URL}/auth`;
const REPORTS_BASE_URL = `${API_BASE_URL}/reports`;

export const SALES_PARTYWISE_URL = `${REPORTS_BASE_URL}/sales/customer?party=`;
export const PURCHASE_PARTYWISE_URL = `${REPORTS_BASE_URL}/purchases/supplier?party=`;

export const SALES_SUMMARY_URL = `${REPORTS_BASE_URL}/sales/KPI-summary`;
export const SALES_MONTHLY_URL = `${REPORTS_BASE_URL}/sales/monthly`;
export const SALES_PARTY_URL = `${REPORTS_BASE_URL}/sales/customers`;
export const PURCHASE_SUMMARY_URL = `${REPORTS_BASE_URL}/purchases/KPI-summary`;
export const PURCHASE_MONTHLY_URL = `${REPORTS_BASE_URL}/purchases/monthly`;
export const PURCHASE_PARTY_URL = `${REPORTS_BASE_URL}/purchases/suppliers`;

export const SALES_ITEMS_URL = `${REPORTS_BASE_URL}/sales/items`;
export const PURCHASE_ITEMS_URL = `${REPORTS_BASE_URL}/purchases/items`;
export const SALES_ITEMWISE_URL = `${REPORTS_BASE_URL}/sales/item?item=`;
export const PURCHASE_ITEMWISE_URL = `${REPORTS_BASE_URL}/purchases/item?item=`;

export const SALES_OUTSTANDING_URL = `${REPORTS_BASE_URL}/outstanding/sales`;
export const PURCHASE_OUTSTANDING_URL = `${REPORTS_BASE_URL}/outstanding/purchases`;
