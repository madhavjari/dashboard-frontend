import { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useNavigate } from "react-router";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        },
      );

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        if (data?.errors?.email) {
          setError(data.errors.email.join(", "));
          return;
        }

        throw new Error(data.message || "Something went wrong");
      }
      alert(data.message);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <Card>
        <header className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Forgot Password?
          </p>

          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Recover your password
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Enter your email address and we'll send you a new verification link.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={100}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button loading={loading} type="submit">
            Resend Verification Email
          </Button>
        </form>
      </Card>
    </div>
  );
}
