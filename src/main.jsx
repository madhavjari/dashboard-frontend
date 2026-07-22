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
import SalesDashboard from "./pages/dashboard/SalesDashboard.jsx";
import ItemSalesDashboard from "./pages/dashboard/ItemSalesDashboard.jsx";
import CustomerDetailPage from "./pages/dashboard/CustomerDetailPage.jsx";

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
    element: <SalesDashboard />,
  },
  {
    path: "/itemwise-dashboard",
    element: <ItemSalesDashboard />,
  },
  {
    path: "/customer",
    element: <CustomerDetailPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
