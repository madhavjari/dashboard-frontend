import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LayoutDashboard,
  LockKeyhole,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";

import Input from "../../components/ui/Input";
import useAuth from "../../config/useAuth";
import { AUTH_BASE_URL } from "../../config/reportUrls";

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateAccessToken } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setErrors((current) => ({
      ...current,
      general: undefined,
      [name]: undefined,
    }));
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${AUTH_BASE_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
          return;
        }
        throw new Error(data.message || "Invalid email or password");
      }

      updateAccessToken(data.accessToken, {
        user: { isVerified: data.isVerified },
        accounts: data.accounts ?? [],
      });

      const hasConfiguredAccount = data.accounts?.some(
        (account) => account.sync?.configured,
      );
      const requestedLocation = location.state?.from;
      const requestedPath = requestedLocation
        ? `${requestedLocation.pathname}${requestedLocation.search ?? ""}${requestedLocation.hash ?? ""}`
        : null;

      navigate(
        hasConfiguredAccount
          ? requestedPath || "/dashboard-summary"
          : "/sync-setup",
        { replace: true },
      );
    } catch (error) {
      setErrors({
        general: [
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-3">
          <span className="rounded-lg bg-slate-950 p-2 text-white">
            <LayoutDashboard aria-hidden="true" size={20} />
          </span>
          <span>
            <span className="block text-lg font-bold tracking-tight text-slate-950">
              Prana
            </span>
            <span className="block text-xs text-slate-500">
              Breathing Life into Businesses
            </span>
          </span>
        </Link>

        <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
          <header className="mb-8">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-teal-700">
              <LockKeyhole aria-hidden="true" size={16} />
              Secure access
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome back
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Sign in to view your business dashboard.
            </p>
          </header>

          {errors?.general?.map((error) => (
            <div
              key={error}
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
            >
              {error}
            </div>
          ))}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Input
                label="Email address"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                maxLength={100}
                autoComplete="email"
                autoFocus
                aria-invalid={Boolean(errors?.email?.length)}
                aria-describedby={
                  errors?.email?.length ? "email-error" : undefined
                }
                placeholder="you@company.com"
                inputClassName="focus:border-teal-600 focus:ring-teal-100"
              />
              {errors?.email?.length ? (
                <div id="email-error" className="mt-1 text-sm text-red-500">
                  {errors.email.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              ) : null}
            </div>

            <div>
              <Input
                label="Password"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                maxLength={32}
                autoComplete="current-password"
                aria-invalid={Boolean(errors?.password?.length)}
                aria-describedby={
                  errors?.password?.length ? "password-error" : undefined
                }
                placeholder="Enter your password"
                inputClassName="pr-10 focus:border-teal-600 focus:ring-teal-100"
                trailingElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="cursor-pointer rounded p-1 text-gray-400 transition hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-100"
                  >
                    {showPassword ? (
                      <EyeOff aria-hidden="true" size={18} />
                    ) : (
                      <Eye aria-hidden="true" size={18} />
                    )}
                  </button>
                }
              />
              {errors?.password?.length ? (
                <div id="password-error" className="mt-1 text-sm text-red-500">
                  {errors.password.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-teal-700 hover:text-teal-800 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign in <ArrowRight aria-hidden="true" size={17} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 border-t border-gray-100 pt-5 text-center text-sm text-gray-500">
            New to Prana?{" "}
            <Link
              to="/register"
              className="font-semibold text-teal-700 hover:text-teal-800 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </section>

        <p className="mt-5 text-center text-xs text-slate-500">
          Sales, purchases and outstanding balances in one workspace.
        </p>
      </div>
    </main>
  );
}
