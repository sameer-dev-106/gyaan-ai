import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import VerifyEmail from "../features/auth/pages/VerifyEmail";
import CheckInbox from "../features/auth/pages/CheckInbox";
import CompleteProfile from "../features/auth/pages/CompleteProfile";
import Dashboard from "../features/chats/pages/Dashboard";
import Settings from "../features/settings/pages/Settings";
import Protected from "../features/auth/components/Protected";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
  },
  {
    path: "/settings",
    element: (
      <Protected>
        <Settings />
      </Protected>
    ),
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/check-inbox",
    element: <CheckInbox />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/complete-profile",
    element: (
      <Protected>
        <CompleteProfile />
      </Protected>
    ),
  },
]);
