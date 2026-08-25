import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Copy,
  KeyRound,
  MonitorUp,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router";
import useAuth from "../../config/useAuth";
import { API_BASE_URL } from "../../config/reportUrls";

function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
        <RefreshCw className="animate-spin" size={20} />
        Loading your connection settings...
      </div>
    </div>
  );
}

export default function SyncSetupPage() {
  const {
    accessToken,
    user,
    accounts,
    accountAccessStatus,
    accountAccessError,
    refreshAccountAccess,
  } = useAuth();
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [machineName, setMachineName] = useState(
    "Primary accounting computer",
  );
  const [generatedCredential, setGeneratedCredential] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [existingApiKey, setExistingApiKey] = useState("");
  const [isRegisteringCompany, setIsRegisteringCompany] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [registeredCompany, setRegisteredCompany] = useState(null);
  const [showCompanyForm, setShowCompanyForm] = useState(false);

  const selectedAccount = useMemo(
    () =>
      accounts.find((account) => account.id === selectedAccountId) ??
      accounts.find((account) => !account.sync?.configured) ??
      accounts[0],
    [accounts, selectedAccountId],
  );

  const handleGenerate = async (event) => {
    event.preventDefault();
    if (!selectedAccount) return;

    setIsGenerating(true);
    setError("");
    setCopied(false);

    try {
      const response = await fetch(
        `${API_BASE_URL}/companies/${selectedAccount.id}/sync-sources`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: machineName.trim() }),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to generate the API key");
      }

      setGeneratedCredential({
        accountId: selectedAccount.id,
        accountName: selectedAccount.name,
        syncSource: data.syncSource,
        apiKey: data.apiKey,
      });

      try {
        await refreshAccountAccess(accessToken);
      } catch {
        // The key is already generated and must remain visible even if the
        // follow-up status refresh fails.
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedCredential?.apiKey?.value) return;

    try {
      await navigator.clipboard.writeText(generatedCredential.apiKey.value);
      setCopied(true);
    } catch {
      setError("Copy failed. Select the key and copy it manually.");
    }
  };

  const handleCompanyRegistration = async (event) => {
    event.preventDefault();
    if (!selectedAccount) return;

    const formData = new FormData(event.currentTarget);
    const externalCompanyId = String(
      formData.get("externalCompanyId") ?? "",
    ).trim();
    const companyName = String(formData.get("companyName") ?? "").trim();
    const syncApiKey = generatedForSelectedAccount
      ? generatedCredential.apiKey.value
      : existingApiKey.trim();

    if (!syncApiKey) {
      setRegistrationError("Enter the API key saved on this computer.");
      return;
    }

    setIsRegisteringCompany(true);
    setRegistrationError("");

    try {
      const response = await fetch(`${API_BASE_URL}/sync/companies`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${syncApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companies: [{ externalCompanyId, name: companyName }],
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to register the accounting company",
        );
      }

      setRegisteredCompany({
        accountId: selectedAccount.id,
        externalCompanyId,
        name: companyName,
      });
      setExistingApiKey("");
      setShowCompanyForm(false);

      try {
        await refreshAccountAccess(accessToken);
      } catch {
        // Registration succeeded; the local confirmation remains visible if
        // refreshing the workspace status fails.
      }
    } catch (requestError) {
      setRegistrationError(requestError.message);
    } finally {
      setIsRegisteringCompany(false);
    }
  };

  if (
    accountAccessStatus === "idle" ||
    accountAccessStatus === "loading"
  ) {
    return <LoadingState />;
  }

  if (accountAccessStatus === "error" && accounts.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <section className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-bold text-slate-950">
            We could not load your workspace
          </h1>
          <p className="mt-2 text-sm text-slate-600">{accountAccessError}</p>
          <button
            type="button"
            onClick={() => {
              refreshAccountAccess(accessToken).catch(() => {});
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
          >
            <RefreshCw size={16} /> Retry
          </button>
        </section>
      </main>
    );
  }

  if (accounts.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <section className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-xl font-bold text-slate-950">
            No workspace is attached to this account
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Contact support before connecting the accounting software.
          </p>
        </section>
      </main>
    );
  }

  const isConfigured = selectedAccount?.sync?.configured;
  const canGenerate =
    selectedAccount?.canManageSync && user?.isVerified && !isConfigured;
  const generatedForSelectedAccount =
    generatedCredential?.accountId === selectedAccount?.id;
  const storedAccountingCompanies =
    selectedAccount?.accountingCompanies ?? [];
  const registeredForSelectedAccount =
    registeredCompany?.accountId === selectedAccount?.id;
  const hasRegisteredCompany =
    storedAccountingCompanies.length > 0 || registeredForSelectedAccount;
  const numericExternalCompanyIds = storedAccountingCompanies
    .map((company) => Number(company.externalId))
    .filter(Number.isSafeInteger);
  const suggestedExternalCompanyId = numericExternalCompanyIds.length
    ? String(Math.max(...numericExternalCompanyIds) + 1)
    : "1";
  const shouldShowCompanyForm =
    !hasRegisteredCompany || showCompanyForm;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="text-xl font-bold tracking-tight text-slate-950">
          Prana
        </Link>

        <header className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
            Data connection
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Connect your accounting computer
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Generate a private credential for the computer running your Prana
            sync software. It connects accounting records to the selected
            workspace.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {accounts.length > 1 && (
            <div className="mb-6">
              <label
                htmlFor="account"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Workspace
              </label>
              <select
                id="account"
                value={selectedAccount?.id ?? ""}
                onChange={(event) => {
                  setSelectedAccountId(event.target.value);
                  setError("");
                  setCopied(false);
                  setExistingApiKey("");
                  setRegistrationError("");
                  setRegisteredCompany(null);
                  setShowCompanyForm(false);
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              >
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-start gap-4 rounded-xl bg-slate-50 p-4">
            <span className="rounded-lg bg-white p-2.5 text-teal-700 shadow-sm">
              <MonitorUp size={22} />
            </span>
            <div>
              <h2 className="font-bold text-slate-950">
                {selectedAccount?.name}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {isConfigured
                  ? hasRegisteredCompany
                    ? "Your accounting company is ready to synchronize."
                    : "Your API key is active. Register the accounting company next."
                  : "No accounting API key has been generated yet."}
              </p>
              <span
                className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                  isConfigured && hasRegisteredCompany
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {isConfigured && hasRegisteredCompany
                  ? "Connected"
                  : "Setup required"}
              </span>
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {generatedForSelectedAccount ? (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 text-emerald-700" size={22} />
                <div>
                  <h2 className="font-bold text-emerald-950">
                    API key generated
                  </h2>
                  <p className="mt-1 text-sm text-emerald-900/75">
                    Copy it now. For security, Prana will not display this key
                    again after you leave this page.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <input
                  aria-label="Generated API key"
                  readOnly
                  value={generatedCredential.apiKey.value}
                  onFocus={(event) => event.target.select()}
                  className="min-w-0 flex-1 rounded-lg border border-emerald-300 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Copied" : "Copy key"}
                </button>
              </div>

            </div>
          ) : isConfigured ? (
            <div className="mt-6">
              <p className="text-sm text-slate-600">
                The secret key cannot be displayed again. You can use the key
                saved on your accounting computer for the remaining setup.
              </p>
            </div>
          ) : !user?.isVerified ? (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Verify your email address before generating an API key.
            </div>
          ) : !selectedAccount?.canManageSync ? (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Only a workspace owner or administrator can generate this key.
            </div>
          ) : (
            <form onSubmit={handleGenerate} className="mt-6">
              <label
                htmlFor="machine-name"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Computer name
              </label>
              <input
                id="machine-name"
                value={machineName}
                onChange={(event) => setMachineName(event.target.value)}
                minLength={2}
                maxLength={100}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              />
              <p className="mt-2 text-xs text-slate-500">
                Use a recognizable name such as Office PC or Accounts Server.
              </p>
              <button
                type="submit"
                disabled={!canGenerate || isGenerating}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isGenerating ? (
                  <RefreshCw className="animate-spin" size={17} />
                ) : (
                  <KeyRound size={17} />
                )}
                {isGenerating ? "Generating..." : "Generate API key"}
              </button>
            </form>
          )}

          {(isConfigured || generatedForSelectedAccount) && (
            <div className="mt-8 border-t border-slate-200 pt-8">
              <div className="flex items-start gap-3">
                <span className="rounded-lg bg-teal-50 p-2 text-teal-700">
                  <KeyRound size={20} />
                </span>
                <div>
                  <h2 className="font-bold text-slate-950">
                    Register accounting company
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Map the company number used in your accounting database to
                    the name shown in Prana.
                  </p>
                </div>
              </div>

              {hasRegisteredCompany && (
                <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex items-start gap-3">
                    <Check className="mt-0.5 text-emerald-700" size={20} />
                    <div>
                      <h3 className="font-bold text-emerald-950">
                        Registered accounting companies
                      </h3>
                      <div className="mt-2 space-y-1 text-sm text-emerald-900/80">
                        {storedAccountingCompanies.map((company) => (
                          <p key={company.id}>
                            CompNo {company.externalId} — {company.name}
                          </p>
                        ))}
                        {registeredForSelectedAccount &&
                          !storedAccountingCompanies.some(
                            (company) =>
                              company.externalId ===
                              registeredCompany.externalCompanyId,
                          ) && (
                            <p>
                              CompNo {registeredCompany.externalCompanyId} —{" "}
                              {registeredCompany.name}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCompanyForm(true);
                        setRegistrationError("");
                        setExistingApiKey("");
                      }}
                      className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
                    >
                      <KeyRound size={16} /> Add another company
                    </button>
                    <Link
                      to="/dashboard-summary"
                      className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-900 hover:bg-emerald-100"
                    >
                      Continue to dashboard <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              )}

              {shouldShowCompanyForm && (
                <form
                  key={`${selectedAccount?.id}-${suggestedExternalCompanyId}`}
                  onSubmit={handleCompanyRegistration}
                  className="mt-5 space-y-4"
                >
                  {!generatedForSelectedAccount && (
                    <div>
                      <label
                        htmlFor="existing-api-key"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Existing API key
                      </label>
                      <input
                        id="existing-api-key"
                        type="password"
                        value={existingApiKey}
                        onChange={(event) =>
                          setExistingApiKey(event.target.value)
                        }
                        autoComplete="off"
                        required
                        placeholder="Paste the key saved in your accounting software"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-mono text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                      />
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-[0.65fr_1.35fr]">
                    <div>
                      <label
                        htmlFor="external-company-id"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        CompNo
                      </label>
                      <input
                        id="external-company-id"
                        name="externalCompanyId"
                        defaultValue={suggestedExternalCompanyId}
                        maxLength={200}
                        required
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="accounting-company-name"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Company name
                      </label>
                      <input
                        id="accounting-company-name"
                        name="companyName"
                        defaultValue={selectedAccount?.name}
                        maxLength={255}
                        required
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                      />
                    </div>
                  </div>

                  {registrationError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {registrationError}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={isRegisteringCompany}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {isRegisteringCompany ? (
                        <RefreshCw className="animate-spin" size={17} />
                      ) : (
                        <Check size={17} />
                      )}
                      {isRegisteringCompany
                        ? "Registering..."
                        : "Register company"}
                    </button>
                    {hasRegisteredCompany && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowCompanyForm(false);
                          setExistingApiKey("");
                          setRegistrationError("");
                        }}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
