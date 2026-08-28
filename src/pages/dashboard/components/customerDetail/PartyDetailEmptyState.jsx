import { ArrowLeft, Building2, SearchX } from "lucide-react";
import { Link } from "react-router";

export default function PartyDetailEmptyState({
  party,
  context,
  overviewUrl,
  canViewAllCompanies,
  onViewAllCompanies,
}) {
  const isSales = context === "Sales";
  const partyType = isSales ? "customer" : "supplier";
  const activityType = isSales ? "sales" : "purchase";

  return (
    <main className="app-page">
      <div className="app-page-inner">
        <section
          className="surface-card mx-auto mt-10 max-w-2xl overflow-hidden text-center"
          aria-labelledby="party-empty-title"
        >
          <div className="px-6 py-9 sm:px-10 sm:py-11">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <SearchX size={25} aria-hidden="true" />
            </span>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-teal-700">
              No {partyType} data
            </p>
            <h1
              id="party-empty-title"
              className="mt-2 break-words text-xl font-bold text-slate-950 sm:text-2xl"
            >
              No {activityType} activity found for {party || `this ${partyType}`}
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">
              This {partyType} may not exist in the current company selection,
              or may have no activity in the selected financial year.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              {canViewAllCompanies ? (
                <button
                  type="button"
                  onClick={onViewAllCompanies}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
                >
                  <Building2 size={17} aria-hidden="true" />
                  View across all companies
                </button>
              ) : null}
              <Link
                to={overviewUrl}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                <ArrowLeft size={17} aria-hidden="true" /> Back to {partyType}s
              </Link>
            </div>
          </div>
          <p className="border-t border-slate-100 bg-slate-50 px-6 py-3 text-xs leading-5 text-slate-500">
            You can also change the company or financial year using the filters
            above.
          </p>
        </section>
      </div>
    </main>
  );
}
