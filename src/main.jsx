import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import SignupForm from "./pages/auth/SignupForm.jsx";
import LoginForm from "./pages/auth/LoginForm.jsx";
import AuthProvider from "./AuthProvider.jsx";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router";
import VerifyEmail from "./pages/auth/VerifyEmail.jsx";
import ResendVerificationEmail from "./pages/auth/ResendVerificationMail.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import DashboardPage from "./pages/dashboard/DashboardPage.jsx";
import DashboardLayout from "./pages/dashboard/DashboardLayout.jsx";
import GuestRoute from "./pages/auth/GuestRoute.jsx";
import ProtectedRoute from "./pages/auth/ProtectedRoute.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { dashboardRoutes } from "./config/dashboardRoutes.js";

function createDashboardChildren() {
  return dashboardRoutes.map(({ path, page, reportType }) => ({
    path,
    element: <DashboardPage page={page} reportType={reportType} />,
  }));
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [{ index: true, element: <HomePage /> }],
  },
  {
    element: <GuestRoute />,
    children: [
      { path: "/login", element: <LoginForm /> },
      { path: "/register", element: <SignupForm /> },
      { path: "/verify-email", element: <VerifyEmail /> },
      {
        path: "/resend-verification",
        element: <ResendVerificationEmail />,
      },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/password-reset", element: <ResetPassword /> },
    ],
  },
  {
    path: "/demo",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard-summary" replace /> },
      ...createDashboardChildren(),
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <DashboardLayout />,
        children: createDashboardChildren(),
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
