import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import SignupForm from "./pages/auth/SignupForm.jsx";
import LoginForm from "./pages/auth/LoginForm.jsx";
import AuthProvider from "./AuthProvider.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import VerifyEmail from "./pages/auth/VerifyEmail.jsx";
import ResendVerificationEmail from "./pages/auth/ResendVerificationMail.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import SummaryDashboard from "./pages/dashboard/SummaryDashboard.jsx";
import ItemDashboard from "./pages/dashboard/ItemDashboard.jsx";
import CustomerDetailPage from "./pages/dashboard/CustomerDetailPage.jsx";
import useData from "./utils/fetch/useData.js";

const SALES_SUMMARY_URL =
  "http://localhost:5000/api/v1/reports/sales/KPI-Summary";
const SALES_PARTY_URL = "http://localhost:5000/api/v1/reports/sales/customers";

const PURCHASE_SUMMARY_URL =
  "http://localhost:5000/api/v1/reports/purchases/KPI-Summary";
const PURCHASE_PARTY_URL =
  "http://localhost:5000/api/v1/reports/purchases/suppliers";

const SALES_ITEMS_URL = "http://localhost:5000/api/v1/reports/sales/items";

const PURCHASE_ITEMS_URL =
  "http://localhost:5000/api/v1/reports/purchases/items";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/register",
    element: <SignupForm />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/resend-verification",
    element: <ResendVerificationEmail />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/password-reset",
    element: <ResetPassword />,
  },
  {
    path: "/sales-dashboard",
    element: (
      <SummaryDashboard
        header={"Sales Dashboard"}
        context={"Sales"}
        useData={useData}
        SUMMARY_URL={SALES_SUMMARY_URL}
        PARTY_URL={SALES_PARTY_URL}
      />
    ),
  },
  {
    path: "/sales-itemwise-dashboard",
    element: <ItemDashboard ITEMS_URL={SALES_ITEMS_URL} />,
  },
  {
    path: "/purchase-itemwise-dashboard",
    element: <ItemDashboard ITEMS_URL={PURCHASE_ITEMS_URL} />,
  },
  {
    path: "/customer",
    element: <CustomerDetailPage />,
  },
  {
    path: "/purchase-dashboard",
    element: (
      <SummaryDashboard
        header={"Purchase Dashboard"}
        context={"Purchase"}
        useData={useData}
        SUMMARY_URL={PURCHASE_SUMMARY_URL}
        PARTY_URL={PURCHASE_PARTY_URL}
      />
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
