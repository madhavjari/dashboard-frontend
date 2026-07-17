import { useState } from "react";
import { useNavigate, Link } from "react-router";

import useAuth from "../../config/useAuth";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function LoginForm() {
  const navigate = useNavigate();
  const { updateAccessToken } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setErrors({});

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
          return;
        }

        throw new Error(data.message || "Invalid login credentials");
      }

      updateAccessToken(data.accessToken);

      alert("Login successful!");
      navigate("/");
    } catch (err) {
      setErrors({
        general: [err.message],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <Card>
        <header className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Secure Access
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Welcome back
          </h1>

          <p className="mt-2 text-gray-500">
            Sign in to continue to your writing dashboard.
          </p>
        </header>

        {errors?.general?.map((err) => (
          <div
            key={err}
            className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
          >
            {err}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Input
              label="Email"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              maxLength={100}
            />
            {errors?.email?.map((err) => (
              <p key={err} className="mt-1 text-sm text-red-500">
                {err}
              </p>
            ))}
          </div>

          <div>
            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              maxLength={32}
            />
            {errors?.password?.map((err) => (
              <p key={err} className="mt-1 text-sm text-red-500">
                {err}
              </p>
            ))}
          </div>

          <Button loading={loading} type="submit">
            Login
          </Button>
        </form>
        <Link to="/forgot-password">Forgot Password?</Link>
      </Card>
    </div>
  );
}
