export default function Loading({ header, message }) {
  return (
    <main className="app-page" aria-busy="true" aria-live="polite">
      <div className="app-page-inner animate-pulse">
        <p className="text-sm font-semibold text-teal-700">Loading report</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">{header}</h1>
        <p className="mt-2 text-sm text-slate-500">{message}</p>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => <div key={item} className="surface-card h-32 p-5"><div className="h-3 w-24 rounded bg-slate-200" /><div className="mt-5 h-7 w-32 rounded bg-slate-200" /><div className="mt-3 h-3 w-40 rounded bg-slate-100" /></div>)}
        </div>
        <div className="surface-card mt-6 h-80 p-6"><div className="h-4 w-40 rounded bg-slate-200" /><div className="mt-8 h-56 rounded-xl bg-slate-100" /></div>
      </div>
    </main>
  );
}
