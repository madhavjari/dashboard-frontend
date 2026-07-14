import { useState } from "react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

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
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload = {
      ...formData,
      phoneNumber: `+91${formData.phoneNumber}`,
    };
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        const message = data.errors
          ? Object.values(data.errors).flat().join(", ")
          : "Invalid inputs";

        throw new Error(message);
      }
      alert("Registered successful!");
    } catch (err) {
      setError(err.message);
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
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <Card>
        <header className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Secure Access
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Welcome</h1>
          <p className="mt-2 text-gray-500">
            Register to start viewing your business dashboard.
          </p>
        </header>
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          <Input
            label="First Name"
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            required
            minLength={2}
            maxLength={32}
            onChange={handleChange}
          />
          <Input
            label="Last Name"
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={32}
          />

          <Input
            wrapperClassName="md:col-span-2"
            label="Email"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Phone Number"
            id="phoneNumber"
            name="phoneNumber"
            type="text"
            prefix="+91"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />

          <Input
            label="Company Name"
            id="companyName"
            name="companyName"
            type="text"
            value={formData.companyName}
            onChange={handleChange}
            required
          />

          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Input
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button loading={loading} type="submit" className="md:col-span-2">
            Register
          </Button>
        </form>
      </Card>
    </div>
  );
}
