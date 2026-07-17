import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState(token ? "verifying" : "error");

  useEffect(() => {
    if (!token) return;
    async function verifyToken() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/verify-password-reset-token?token=${encodeURIComponent(token)}`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
          },
        );

        const data = await response.json();
        if (!response.ok) {
          console.log(data);
          setStatus("error");
          return;
        }
        setStatus("verified");
      } catch {
        setStatus("error");
      }
    }
    verifyToken();
  }, [token]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/reset-password?token=${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        setErrors(data.errors || {});
        return;
      }
    } catch (err) {
      setErrors({
        message: err.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  if (status === "verifying") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <h1 className="text-2xl font-bold text-gray-900">
            Checking reset link
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Please wait while we verify your password reset link.
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <span className="text-2xl text-red-600">!</span>
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Invalid Reset Link
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            This password reset link is invalid or has expired. Please request a
            new password reset link.
          </p>

          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="cursor-pointer mt-6 w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Request New Reset Link
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="cursor-pointer mt-3 w-full rounded-lg border border-gray-300 px-4 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        <h1 className="text-2xl font-bold text-gray-900">Password Reset</h1>
        {errors?.message ? (
          <p className="mt-1 text-sm text-red-500">{errors.message}</p>
        ) : null}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          <div>
            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors?.password?.map((err) => (
              <p key={err} className="mt-1 text-sm text-red-500">
                {err}
              </p>
            ))}
          </div>
          <div>
            <Input
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors?.confirmPassword?.map((err) => (
              <span key={err} className="mt-1 text-sm text-red-500">
                {err}
              </span>
            ))}
          </div>
          <Button loading={loading} type="submit" className="md:col-span-2">
            Register
          </Button>
        </form>
      </div>
    </div>
  );
}
