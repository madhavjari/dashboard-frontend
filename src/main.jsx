/* eslint-disable react-refresh/only-export-components -- application entry point defines lazy route boundaries */
import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import AuthProvider from "./AuthProvider.jsx";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { dashboardRoutes } from "./config/dashboardRoutes.js";

const SignupForm = lazy(() => import("./pages/auth/SignupForm.jsx"));
const LoginForm = lazy(() => import("./pages/auth/LoginForm.jsx"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail.jsx"));
const ResendVerificationEmail = lazy(() => import("./pages/auth/ResendVerificationMail.jsx"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword.jsx"));
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage.jsx"));
const DashboardLayout = lazy(() => import("./pages/dashboard/DashboardLayout.jsx"));
const GuestRoute = lazy(() => import("./pages/auth/GuestRoute.jsx"));
const ProtectedRoute = lazy(() => import("./pages/auth/ProtectedRoute.jsx"));
const SyncConfiguredRoute = lazy(() => import("./pages/auth/SyncConfiguredRoute.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));
const SyncSetupPage = lazy(() => import("./pages/dashboard/SyncSetupPage.jsx"));

function RouteFallback() {
  return <div className="flex min-h-screen items-center justify-center bg-[#f4f7f6]" role="status" aria-label="Loading page"><span className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-teal-700" /></div>;
}

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
        path: "/sync-setup",
        element: <SyncSetupPage />,
      },
      {
        element: <SyncConfiguredRoute />,
        children: [
          {
            path: "/",
            element: <DashboardLayout />,
            children: createDashboardChildren(),
          },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Suspense fallback={<RouteFallback />}>
        <RouterProvider router={router} />
      </Suspense>
    </AuthProvider>
  </StrictMode>,
);
