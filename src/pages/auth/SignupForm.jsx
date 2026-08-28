import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Mail,
  LayoutDashboard,
  LockKeyhole,
} from "lucide-react";
import { Link } from "react-router";

import Input from "../../components/ui/Input";
import { AUTH_BASE_URL } from "../../config/reportUrls";

function FieldErrors({ id, errors }) {
  if (!errors?.length) return null;

  return (
    <div id={id} className="mt-1 text-sm text-red-500">
      {errors.map((error) => (
        <p key={error}>{error}</p>
      ))}
    </div>
  );
}

export default function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    companyName: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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

    const payload = {
      ...formData,
      phoneNumber: `+91${formData.phoneNumber}`,
    };

    try {
      const response = await fetch(`${AUTH_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
          return;
        }
        throw new Error(data.message || "Unable to create your account");
      }

      setSuccessMessage(data.message || "Your account has been created.");
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

  if (successMessage) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm" role="status">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><CheckCircle2 size={24} /></span>
          <h1 className="mt-5 text-2xl font-bold text-slate-950">Workspace account created</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{successMessage}</p>
          <div className="mt-6 rounded-xl bg-slate-50 p-4 text-left"><p className="flex items-center gap-2 text-sm font-semibold text-slate-800"><Mail size={16} className="text-teal-700" /> Check your inbox</p><p className="mt-1 text-xs leading-5 text-slate-500">Verify your email before connecting an accounting computer.</p></div>
          <Link to="/login" className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800">Continue to sign in <ArrowRight size={16} /></Link>
          <Link to="/" className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-slate-600 hover:text-teal-700">Back to homepage</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-xl">
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
              Secure registration
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Create your account
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Set up your Prana workspace to start viewing your business data.
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

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            <div>
              <Input
                label="First name"
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={32}
                autoComplete="given-name"
                autoFocus
                aria-invalid={Boolean(errors?.firstName?.length)}
                aria-describedby={
                  errors?.firstName?.length ? "first-name-error" : undefined
                }
                placeholder="First name"
                inputClassName="focus:border-teal-600 focus:ring-teal-100"
              />
              <FieldErrors id="first-name-error" errors={errors?.firstName} />
            </div>

            <div>
              <Input
                label="Last name"
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={32}
                autoComplete="family-name"
                aria-invalid={Boolean(errors?.lastName?.length)}
                aria-describedby={
                  errors?.lastName?.length ? "last-name-error" : undefined
                }
                placeholder="Last name"
                inputClassName="focus:border-teal-600 focus:ring-teal-100"
              />
              <FieldErrors id="last-name-error" errors={errors?.lastName} />
            </div>

            <div className="md:col-span-2">
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
                aria-invalid={Boolean(errors?.email?.length)}
                aria-describedby={
                  errors?.email?.length ? "signup-email-error" : undefined
                }
                placeholder="you@company.com"
                inputClassName="focus:border-teal-600 focus:ring-teal-100"
              />
              <FieldErrors id="signup-email-error" errors={errors?.email} />
            </div>

            <div>
              <Input
                label="Phone number"
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                maxLength={10}
                inputMode="numeric"
                autoComplete="tel-national"
                aria-invalid={Boolean(errors?.phoneNumber?.length)}
                aria-describedby={
                  errors?.phoneNumber?.length ? "phone-error" : undefined
                }
                placeholder="10-digit number"
                inputClassName="focus:border-teal-600 focus:ring-teal-100"
              />
              <FieldErrors id="phone-error" errors={errors?.phoneNumber} />
            </div>

            <div>
              <Input
                label="Company name"
                id="companyName"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleChange}
                required
                maxLength={100}
                autoComplete="organization"
                aria-invalid={Boolean(errors?.companyName?.length)}
                aria-describedby={
                  errors?.companyName?.length ? "company-error" : undefined
                }
                placeholder="Company name"
                inputClassName="focus:border-teal-600 focus:ring-teal-100"
              />
              <FieldErrors id="company-error" errors={errors?.companyName} />
            </div>

            <div>
              <Input
                label="Password"
                id="signupPassword"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                maxLength={32}
                autoComplete="new-password"
                aria-invalid={Boolean(errors?.password?.length)}
                aria-describedby={
                  errors?.password?.length ? "signup-password-error" : undefined
                }
                placeholder="Minimum 8 characters"
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
              <FieldErrors
                id="signup-password-error"
                errors={errors?.password}
              />
            </div>

            <div>
              <Input
                label="Confirm password"
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
                maxLength={32}
                autoComplete="new-password"
                aria-invalid={Boolean(errors?.confirmPassword?.length)}
                aria-describedby={
                  errors?.confirmPassword?.length
                    ? "confirm-password-error"
                    : undefined
                }
                placeholder="Repeat your password"
                inputClassName="pr-10 focus:border-teal-600 focus:ring-teal-100"
                trailingElement={
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((visible) => !visible)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirmed password"
                        : "Show confirmed password"
                    }
                    aria-pressed={showConfirmPassword}
                    className="cursor-pointer rounded p-1 text-gray-400 transition hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-100"
                  >
                    {showConfirmPassword ? (
                      <EyeOff aria-hidden="true" size={18} />
                    ) : (
                      <Eye aria-hidden="true" size={18} />
                    )}
                  </button>
                }
              />
              <FieldErrors
                id="confirm-password-error"
                errors={errors?.confirmPassword}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  Create account <ArrowRight aria-hidden="true" size={17} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 border-t border-gray-100 pt-5 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-teal-700 hover:text-teal-800 hover:underline"
            >
              Sign in
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
