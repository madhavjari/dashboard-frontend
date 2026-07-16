import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState(token ? "verifying" : "error");
  const [message, setMessage] = useState(
    token ? "Validating your email token..." : "No token provided.",
  );
  const navigate = useNavigate();

  useEffect(() => {
    async function verifyToken() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/verify-email?token=${encodeURIComponent(token)}`,
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
          setMessage(data.message);
          return;
        }
        setStatus("success");
        setMessage("Your email has been verified successfully.");
        setTimeout(() => navigate("/login"), 3000);
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    }
    verifyToken();
  }, [token, navigate]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        <h1 className="text-2xl font-bold text-gray-900">Email Verification</h1>

        {status === "verifying" && (
          <div className="mt-6">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="text-blue-600">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="mt-6">
            <p className="text-green-600">{message}</p>

            <p className="mt-2 text-sm text-gray-500">
              Redirecting you to login...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="mt-6">
            <p className="text-red-600">{message}</p>

            <button
              onClick={() => navigate("/resend-verification")}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
            >
              Resend Verification Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
