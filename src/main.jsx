import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import SignupForm from "./pages/auth/SignupForm.jsx";
import LoginForm from "./pages/auth/LoginForm.jsx";
import AuthProvider from "./AuthProvider.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import VerifyEmail from "./pages/auth/VerifyEmail.jsx";

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
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
