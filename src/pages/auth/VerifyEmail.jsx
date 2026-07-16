import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Validating your email token...");
  const navigate = useNavigate();
  if (!token) {
    setMessage("No token provided");
    setStatus("error");
  }
  useEffect(() => {
    async function verifyToken() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/verify-email?token=${token}`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({ token: token }),
          },
        );
        setStatus("success");
        const data = await response.json();
        if (!response.ok) {
          setStatus(data.message);
          return;
        }
        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        console.log("bjrnlb", err);
      }
    }
    token ? verifyToken() : null;
  }, [token, navigate]);
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Email Verification</h2>
      {status === "verifying" && <p style={{ color: "blue" }}>{message}</p>}
      {status === "success" && (
        <p style={{ color: "green" }}>{message} Redirecting to login...</p>
      )}
      {status === "error" ||
        (status === "Invalid Token" && (
          <div>
            <p style={{ color: "red" }}>{message}</p>
            <button onClick={() => navigate("/resend-verification")}>
              Resend Email
            </button>
          </div>
        ))}
    </div>
  );
}
