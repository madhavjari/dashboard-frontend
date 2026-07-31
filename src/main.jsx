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
import ItemDetailPage from "./pages/dashboard/ItemDetailPage.jsx";
import OutstandingDashboard from "./pages/dashboard/OutstandingDashboard.jsx";
import useData from "./utils/fetch/useData.js";
import {
  PURCHASE_ITEMS_URL,
  PURCHASE_ITEMWISE_URL,
  PURCHASE_PARTY_URL,
  PURCHASE_PARTYWISE_URL,
  PURCHASE_OUTSTANDING_URL,
  PURCHASE_SUMMARY_URL,
  SALES_ITEMS_URL,
  SALES_ITEMWISE_URL,
  SALES_PARTY_URL,
  SALES_PARTYWISE_URL,
  SALES_OUTSTANDING_URL,
  SALES_SUMMARY_URL,
} from "./config/reportUrls.js";

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
        OUTSTANDING_URL={SALES_OUTSTANDING_URL}
      />
    ),
  },
  {
    path: "/sales-itemwise-dashboard",
    element: <ItemDashboard ITEMS_URL={SALES_ITEMS_URL} context={"Sales"} />,
  },
  {
    path: "/purchase-itemwise-dashboard",
    element: (
      <ItemDashboard ITEMS_URL={PURCHASE_ITEMS_URL} context={"Purchase"} />
    ),
  },
  {
    path: "/customer",
    element: (
      <CustomerDetailPage
        PARTY_URL={SALES_PARTYWISE_URL}
        OUTSTANDING_URL={SALES_OUTSTANDING_URL}
        context="Sales"
      />
    ),
  },
  {
    path: "/supplier",
    element: (
      <CustomerDetailPage
        PARTY_URL={PURCHASE_PARTYWISE_URL}
        OUTSTANDING_URL={PURCHASE_OUTSTANDING_URL}
        context="Purchase"
      />
    ),
  },
  {
    path: "/item",
    element: <ItemDetailPage ITEM_URL={SALES_ITEMWISE_URL} context="Sales" />,
  },
  {
    path: "/purchase-item",
    element: (
      <ItemDetailPage ITEM_URL={PURCHASE_ITEMWISE_URL} context="Purchase" />
    ),
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
  {
    path: "/sales-outstanding-dashboard",
    element: (
      <OutstandingDashboard OUTSTANDING_URL={SALES_OUTSTANDING_URL} context="Sales" />
    ),
  },
  {
    path: "/purchase-outstanding-dashboard",
    element: (
      <OutstandingDashboard
        OUTSTANDING_URL={PURCHASE_OUTSTANDING_URL}
        context="Purchase"
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
