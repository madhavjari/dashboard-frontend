function invoiceKey(invoice) {
  return `${String(invoice.party || "").trim().toUpperCase()}|${String(invoice.billNo || "").trim().toUpperCase()}`;
}

export function createInvoiceStatusMap(invoices) {
  return new Map(
    invoices
      .filter((invoice) => invoice.billNo)
      .map((invoice) => [
        invoiceKey(invoice),
        Number(invoice.amountToCollect ?? invoice.amountToPay) <= 0
          ? "Paid"
          : "Unpaid",
      ]),
  );
}

export function getInvoiceStatus(statusMap, invoice) {
  return statusMap.get(invoiceKey(invoice));
}
