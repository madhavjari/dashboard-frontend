export const dashboardRoutes = [
  { path: "dashboard-summary", page: "business-summary" },
  { path: "sales-dashboard", page: "summary", reportType: "sales" },
  { path: "sales-itemwise-dashboard", page: "items", reportType: "sales" },
  { path: "sales-invoices", page: "invoices", reportType: "sales" },
  { path: "purchase-dashboard", page: "summary", reportType: "purchase" },
  {
    path: "purchase-itemwise-dashboard",
    page: "items",
    reportType: "purchase",
  },
  { path: "purchase-invoices", page: "invoices", reportType: "purchase" },
  {
    path: "sales-outstanding-dashboard",
    page: "outstanding",
    reportType: "sales",
  },
  {
    path: "purchase-outstanding-dashboard",
    page: "outstanding",
    reportType: "purchase",
  },
  { path: "customer", page: "party-details", reportType: "sales" },
  { path: "supplier", page: "party-details", reportType: "purchase" },
  { path: "item", page: "item-details", reportType: "sales" },
  { path: "purchase-item", page: "item-details", reportType: "purchase" },
];
