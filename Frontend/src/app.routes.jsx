// src/app.routes.jsx
import Protected from "./features/auth_features/components/Protected";
import { Login } from "./features/auth_features/pages/Login";
import { Register } from "./features/auth_features/pages/Register";
import Home from "./features/interview/pages/Home";
import ErrorPage from "./customErrorPage/ErrorPage";
import AuthCallback from "./features/auth_features/pages/AuthCallback";
import Interview from "./features/interview/pages/Interview";
import MockInterviewPage from "./features/interview/pages/mock-interview/MockInterviewPage";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/interview/:interviewId",
    element: (
      <Protected>
        <Interview />
      </Protected>
    ),
  },
  {
    path: "/mock-interview",
    element: (
      <Protected>
        <MockInterviewPage />
      </Protected>
    ),
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />,
  },
  {
    // Catch-all route hamesha last mein
    path: "*",
    element: <ErrorPage />,
  },
]);