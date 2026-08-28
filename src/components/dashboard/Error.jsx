import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({ message, header, reload }) {
  return (
    <main className="app-page">
      <div className="app-page-inner">
        <div className="surface-card mx-auto mt-10 max-w-xl p-7 text-center sm:p-10" role="alert">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-700"><AlertTriangle size={23} /></span>
          <h1 className="mt-4 text-xl font-bold text-slate-900">Couldn’t load {header.toLowerCase()}</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{message}</p>
          <p className="mt-2 text-xs text-slate-500">Your workspace and financial-year filters are preserved.</p>
          <button
            type="button"
            onClick={reload}
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            <RefreshCw size={16} /> Try again
          </button>
        </div>
      </div>
    </main>
  );
}
