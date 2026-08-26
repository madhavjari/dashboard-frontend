import { useEffect, useRef, useState } from "react";
import { Building2, Check, ChevronDown } from "lucide-react";

export default function CompanySelector({
  companies,
  selectedCompanyIds,
  onChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) setIsOpen(false);
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (companies.length < 2) return null;

  const allCompanyIds = companies.map((company) => company.id);
  const selectedIds = new Set(selectedCompanyIds);
  const allSelected = selectedCompanyIds.length === companies.length;
  const selectedCompanies = companies.filter((company) =>
    selectedIds.has(company.id),
  );
  const selectionLabel = allSelected
    ? "All companies"
    : selectedCompanies.length === 1
      ? selectedCompanies[0].name
      : `${selectedCompanies.length} companies`;

  function toggleCompany(companyId) {
    if (selectedIds.has(companyId)) {
      if (selectedCompanyIds.length === 1) return;
      onChange(selectedCompanyIds.filter((id) => id !== companyId));
      return;
    }
    onChange([...selectedCompanyIds, companyId]);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex min-h-10 min-w-0 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-400 hover:text-teal-800"
      >
        <Building2 size={17} className="shrink-0 text-teal-700" />
        <span className="max-w-48 truncate">{selectionLabel}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-full z-20 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">
              Accounting companies
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Select one or more. Reports combine data from every selection.
            </p>
          </div>

          <div role="listbox" aria-multiselectable="true" className="p-2">
            <button
              type="button"
              role="option"
              aria-selected={allSelected}
              onClick={() => onChange(allCompanyIds)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-slate-50"
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                  allSelected
                    ? "border-teal-700 bg-teal-700 text-white"
                    : "border-slate-300 bg-white text-transparent"
                }`}
              >
                <Check size={14} strokeWidth={3} />
              </span>
              <span className="font-semibold text-slate-800">
                All companies
              </span>
            </button>

            <div className="my-1 border-t border-slate-100" />

            {companies.map((company) => {
              const isSelected = selectedIds.has(company.id);
              const isOnlySelection =
                isSelected && selectedCompanyIds.length === 1;

              return (
                <button
                  key={company.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={isOnlySelection}
                  onClick={() => toggleCompany(company.id)}
                  className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-slate-50"
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                      isSelected
                        ? "border-teal-700 bg-teal-700 text-white"
                        : "border-slate-300 bg-white text-transparent"
                    }`}
                  >
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-slate-800">
                      {company.name}
                    </span>
                    {company.accountName ? (
                      <span className="mt-0.5 block truncate text-xs text-slate-400">
                        {company.accountName}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
