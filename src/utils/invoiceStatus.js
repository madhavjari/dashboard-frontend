function invoiceKey(invoice) {
  return `${String(invoice.party || "").trim().toUpperCase()}|${String(invoice.billNo || "").trim().toUpperCase()}`;
}

export function createInvoiceDetailsMap(invoices) {
  return new Map(
    invoices
      .filter((invoice) => invoice.billNo)
      .map((invoice) => [invoiceKey(invoice), invoice]),
  );
}

export function createInvoiceStatusMap(invoices) {
  return new Map(
    [...createInvoiceDetailsMap(invoices)].map(([key, invoice]) => [
      key,
      Number(
        invoice.amountToCollect ??
          invoice.amountToPay ??
          invoice.amountOutstanding,
      ) <= 0
        ? "Paid"
        : "Unpaid",
    ]),
  );
}

export function getInvoiceDetails(invoiceMap, invoice) {
  return invoiceMap.get(invoiceKey(invoice));
}

export function getInvoiceStatus(statusMap, invoice) {
  return statusMap.get(invoiceKey(invoice));
}
