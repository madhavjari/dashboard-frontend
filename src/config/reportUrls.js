const API_ORIGIN =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";
const API_BASE_URL = `${API_ORIGIN}/api/v1/reports`;

export const SALES_PARTYWISE_URL = `${API_BASE_URL}/sales/customer?party=`;
export const PURCHASE_PARTYWISE_URL = `${API_BASE_URL}/purchases/supplier?party=`;

export const SALES_SUMMARY_URL = `${API_BASE_URL}/sales/KPI-summary`;
export const SALES_MONTHLY_URL = `${API_BASE_URL}/sales/monthly`;
export const SALES_PARTY_URL = `${API_BASE_URL}/sales/customers`;
export const PURCHASE_SUMMARY_URL = `${API_BASE_URL}/purchases/KPI-summary`;
export const PURCHASE_MONTHLY_URL = `${API_BASE_URL}/purchases/monthly`;
export const PURCHASE_PARTY_URL = `${API_BASE_URL}/purchases/suppliers`;

export const SALES_ITEMS_URL = `${API_BASE_URL}/sales/items`;
export const PURCHASE_ITEMS_URL = `${API_BASE_URL}/purchases/items`;
export const SALES_ITEMWISE_URL = `${API_BASE_URL}/sales/item?item=`;
export const PURCHASE_ITEMWISE_URL = `${API_BASE_URL}/purchases/item?item=`;

export const SALES_OUTSTANDING_URL = `${API_BASE_URL}/outstanding/sales`;
export const PURCHASE_OUTSTANDING_URL = `${API_BASE_URL}/outstanding/purchases`;
