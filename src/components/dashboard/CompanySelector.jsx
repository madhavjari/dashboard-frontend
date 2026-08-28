import { useEffect, useRef, useState } from "react";
import { Building2, Check, ChevronDown, X } from "lucide-react";

function haveSameIds(first, second) {
  if (first.length !== second.length) return false;
  const secondIds = new Set(second);
  return first.every((id) => secondIds.has(id));
}

export default function CompanySelector({
  companies,
  selectedCompanyIds,
  onChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingCompanyIds, setPendingCompanyIds] = useState(
    selectedCompanyIds,
  );
  const containerRef = useRef(null);

  useEffect(() => {
    function closeMenu(event) {
      if (!containerRef.current?.contains(event.target)) setIsOpen(false);
    }

    function closeMenuWithKeyboard(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeMenuWithKeyboard);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeMenuWithKeyboard);
    };
  }, []);

  if (companies.length < 2) return null;

  const allCompanyIds = companies.map((company) => company.id);
  const selectedIds = new Set(selectedCompanyIds);
  const selectedCompanies = companies.filter((company) =>
    selectedIds.has(company.id),
  );
  const allSelected = selectedCompanies.length === companies.length;
  const selectionLabel = allSelected
    ? "All companies"
    : selectedCompanies.length === 1
      ? selectedCompanies[0].name
      : `${selectedCompanies.length} companies`;

  const pendingIds = new Set(pendingCompanyIds);
  const pendingAllSelected = pendingCompanyIds.length === companies.length;
  const hasChanges = !haveSameIds(
    pendingCompanyIds,
    selectedCompanyIds,
  );

  function toggleMenu() {
    if (!isOpen) setPendingCompanyIds(selectedCompanyIds);
    setIsOpen((open) => !open);
  }

  function toggleCompany(companyId) {
    if (pendingIds.has(companyId)) {
      if (pendingCompanyIds.length === 1) return;
      setPendingCompanyIds(
        pendingCompanyIds.filter((id) => id !== companyId),
      );
      return;
    }

    const nextIds = new Set([...pendingCompanyIds, companyId]);
    setPendingCompanyIds(
      companies
        .filter((company) => nextIds.has(company.id))
        .map((company) => company.id),
    );
  }

  function applySelection() {
    if (hasChanges) onChange(pendingCompanyIds);
    setIsOpen(false);
  }

  function cancelSelection() {
    setPendingCompanyIds(selectedCompanyIds);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative min-w-0 w-full md:w-auto">
      <button
        type="button"
        onClick={toggleMenu}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={`Company filter: ${selectionLabel}`}
        className={`flex min-h-10 w-full min-w-0 items-center gap-2 rounded-lg border bg-white px-3 py-1.5 text-left shadow-sm transition md:w-auto ${
          isOpen
            ? "border-teal-600 ring-3 ring-teal-100"
            : "border-slate-300 hover:border-teal-400"
        }`}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-700">
          <Building2 size={16} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1 md:flex-initial">
          <span className="block text-[10px] font-bold uppercase leading-3 tracking-wide text-slate-400">
            Company view
          </span>
          <span className="block max-w-40 truncate text-sm font-semibold leading-5 text-slate-800">
            {selectionLabel}
          </span>
        </span>
        <ChevronDown
          size={15}
          aria-hidden="true"
          className={`ml-1 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <section
          role="dialog"
          aria-label="Choose accounting companies"
          className="absolute right-0 top-full z-50 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15"
        >
          <div className="flex items-start gap-3 border-b border-slate-100 px-4 py-3.5">
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-slate-950">
                Choose companies
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Selected company data is combined in every report.
              </p>
            </div>
            <button
              type="button"
              onClick={cancelSelection}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close company menu"
            >
              <X size={17} aria-hidden="true" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 bg-slate-50 px-4 py-2.5">
            <span className="text-xs font-semibold text-slate-600">
              {pendingCompanyIds.length} of {companies.length} selected
            </span>
            <button
              type="button"
              onClick={() => setPendingCompanyIds(allCompanyIds)}
              disabled={pendingAllSelected}
              className="text-xs font-bold text-teal-700 transition hover:text-teal-900 disabled:cursor-default disabled:text-slate-400"
            >
              {pendingAllSelected ? "All selected" : "Select all"}
            </button>
          </div>

          <div
            role="listbox"
            aria-multiselectable="true"
            className="max-h-72 space-y-1 overflow-y-auto p-2"
          >
            {companies.map((company) => {
              const isSelected = pendingIds.has(company.id);
              const isOnlySelection =
                isSelected && pendingCompanyIds.length === 1;

              return (
                <button
                  key={company.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={isOnlySelection}
                  onClick={() => toggleCompany(company.id)}
                  className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition ${
                    isSelected
                      ? "border-teal-200 bg-teal-50/70"
                      : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                  } disabled:cursor-default disabled:opacity-70`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                      isSelected
                        ? "border-teal-700 bg-teal-700 text-white"
                        : "border-slate-300 bg-white text-transparent"
                    }`}
                  >
                    <Check size={14} strokeWidth={3} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-800">
                      {company.name}
                    </span>
                    {company.accountName ? (
                      <span className="mt-0.5 block truncate text-xs text-slate-500">
                        {company.accountName}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-white px-4 py-3">
            <button
              type="button"
              onClick={cancelSelection}
              className="min-h-10 rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={applySelection}
              disabled={!hasChanges}
              className="min-h-10 rounded-lg bg-teal-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-default disabled:bg-slate-200 disabled:text-slate-500"
            >
              Update reports
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
