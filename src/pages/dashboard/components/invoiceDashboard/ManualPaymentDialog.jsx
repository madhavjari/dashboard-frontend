import { useEffect, useMemo, useState } from "react";
import { CalendarDays, LoaderCircle, ReceiptIndianRupee, X } from "lucide-react";
import { fmtDateIN, fmtINR } from "../../../../utils/format";
import {
  cancelManualPayment,
  createManualPayment,
} from "../../../../utils/fetch/manualPayments";

function todayInIndia() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function createIdempotencyKey() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16);
    const value = character === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

const fieldClass =
  "mt-1.5 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-3 focus:ring-teal-100";

export default function ManualPaymentDialog({
  accessToken,
  context,
  financialYear,
  invoice,
  onClose,
  onSaved,
}) {
  const [intent, setIntent] = useState("FULL");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(todayInIndia);
  const [mode, setMode] = useState("");
  const [chequeNo, setChequeNo] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [notes, setNotes] = useState("");
  const [idempotencyKey] = useState(createIdempotencyKey);
  const [submitting, setSubmitting] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState("");
  const balance = Number(invoice.amountOutstanding) || 0;
  const pendingPayments = useMemo(
    () => (invoice.payments ?? []).filter((payment) => payment.source === "MANUAL"),
    [invoice.payments],
  );

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape" && !submitting && !cancellingId) onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [cancellingId, onClose, submitting]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await createManualPayment(accessToken, {
        type: context === "Sales" ? "sales" : "purchases",
        accountingCompanyId: invoice.accountingCompanyId,
        financialYear,
        billEntrySourceId: String(invoice.billEntrySourceId),
        billNo: String(invoice.billNo),
        intent,
        amount: intent === "PARTIAL" ? amount : null,
        paymentDate,
        mode,
        chequeNo,
        referenceNo,
        notes,
        idempotencyKey,
      });
      await onSaved();
      onClose();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancel(paymentId) {
    setError("");
    setCancellingId(paymentId);
    try {
      await cancelManualPayment(accessToken, paymentId);
      await onSaved();
      onClose();
    } catch (cancelError) {
      setError(cancelError.message);
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-0 sm:items-center sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting && !cancellingId) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="manual-payment-title"
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-2xl"
      >
        <header className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
              {context} invoice {invoice.billNo}
            </p>
            <h2 id="manual-payment-title" className="mt-1 text-xl font-bold text-slate-950">
              Record payment
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {invoice.party || "No party name"} · Balance {fmtINR(balance, 2)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting || Boolean(cancellingId)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
            aria-label="Close payment dialog"
          >
            <X size={19} />
          </button>
        </header>

        <div className="space-y-6 px-5 py-5 sm:px-6">
          {pendingPayments.length ? (
            <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h3 className="text-sm font-bold text-amber-950">Waiting for accounting sync</h3>
              <p className="mt-1 text-xs leading-5 text-amber-800">
                These payments already reduce the balance. A later matching voucher will acknowledge them automatically.
              </p>
              <div className="mt-3 space-y-2">
                {pendingPayments.map((payment) => (
                  <div
                    key={payment.manualPaymentId}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-white px-3 py-2.5"
                  >
                    <div>
                      <p className="font-mono-num text-sm font-bold text-slate-950">
                        {fmtINR(payment.adjustedAmount, 2)}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {payment.manualPaymentIntent === "FULL" ? "Full payment" : "Part payment"} ·{" "}
                        {fmtDateIN(payment.paymentDate || payment.chequeDate)}
                        {payment.mode ? ` · ${payment.mode}` : ""}
                      </p>
                      {payment.chequeNo || payment.referenceNo ? (
                        <p className="mt-0.5 text-xs text-slate-500">
                          {payment.chequeNo ? `Cheque ${payment.chequeNo}` : ""}
                          {payment.chequeNo && payment.referenceNo ? " · " : ""}
                          {payment.referenceNo ? `Ref ${payment.referenceNo}` : ""}
                        </p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCancel(payment.manualPaymentId)}
                      disabled={Boolean(cancellingId)}
                      className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                    >
                      {cancellingId === payment.manualPaymentId ? "Cancelling…" : "Cancel entry"}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {balance > 0 ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <fieldset>
                <legend className="text-sm font-semibold text-slate-800">Payment amount</legend>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {["FULL", "PARTIAL"].map((option) => (
                    <label
                      key={option}
                      className={`cursor-pointer rounded-xl border px-4 py-3 text-sm ${
                        intent === option
                          ? "border-teal-600 bg-teal-50 text-teal-900"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="intent"
                        value={option}
                        checked={intent === option}
                        onChange={() => setIntent(option)}
                        className="mr-2 accent-teal-700"
                      />
                      <span className="font-semibold">
                        {option === "FULL" ? "Full payment" : "Part payment"}
                      </span>
                      <span className="mt-1 block pl-5 text-xs text-slate-500">
                        {option === "FULL" ? fmtINR(balance, 2) : "Enter an amount"}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {intent === "PARTIAL" ? (
                <label className="block text-sm font-semibold text-slate-700">
                  Amount
                  <input
                    required
                    type="number"
                    min="0.01"
                    max={balance}
                    step="0.01"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    className={fieldClass}
                    placeholder="0.00"
                  />
                </label>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Payment date
                  <span className="relative block">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 mt-0.5 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      required
                      type="date"
                      value={paymentDate}
                      onChange={(event) => setPaymentDate(event.target.value)}
                      className={`${fieldClass} pl-9`}
                    />
                  </span>
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Mode <span className="font-normal text-slate-400">(optional)</span>
                  <input
                    value={mode}
                    onChange={(event) => setMode(event.target.value)}
                    className={fieldClass}
                    placeholder="CHQ, NEFT, CASH…"
                    maxLength={100}
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Cheque number <span className="font-normal text-slate-400">(optional)</span>
                  <input
                    value={chequeNo}
                    onChange={(event) => setChequeNo(event.target.value)}
                    className={fieldClass}
                    maxLength={100}
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Reference number <span className="font-normal text-slate-400">(optional)</span>
                  <input
                    value={referenceNo}
                    onChange={(event) => setReferenceNo(event.target.value)}
                    className={fieldClass}
                    maxLength={100}
                  />
                </label>
              </div>

              <label className="block text-sm font-semibold text-slate-700">
                Notes <span className="font-normal text-slate-400">(optional)</span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="mt-1.5 min-h-20 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-3 focus:ring-teal-100"
                  maxLength={2000}
                  placeholder="Any detail that will help identify this payment later"
                />
              </label>

              {error ? (
                <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
                  {error}
                </p>
              ) : null}

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
                >
                  {submitting ? <LoaderCircle className="animate-spin" size={16} /> : <ReceiptIndianRupee size={16} />}
                  {submitting ? "Saving…" : "Record payment"}
                </button>
              </div>
            </form>
          ) : (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              This invoice is fully paid. You can still cancel a pending manual entry above if it was added by mistake.
            </div>
          )}

          {error && balance <= 0 ? (
            <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
              {error}
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
