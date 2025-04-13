import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

// Lazy load components for better performance
const Home = lazy(() => import("@/components/home"));
const ChatPage = lazy(() => import("@/components/chat/ChatPage"));
const EmbedPage = lazy(() => import("@/components/chat/EmbedPage"));
const Dashboard = lazy(() => import("@/components/admin/Dashboard"));
const UsersTable = lazy(() => import("@/components/admin/UsersTable"));
const SessionsTable = lazy(() => import("@/components/admin/SessionsTable"));
const ContextRulesTable = lazy(
  () => import("@/components/admin/ContextRulesTable"),
);
const PromptTemplatesTable = lazy(
  () => import("@/components/admin/PromptTemplatesTable"),
);
const ResponseFormatsTable = lazy(
  () => import("@/components/admin/ResponseFormatsTable"),
);

// Define routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/chat",
    element: <ChatPage />,
  },
  {
    path: "/embed",
    element: <EmbedPage />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <UsersTable />,
      },
      {
        path: "sessions",
        element: <SessionsTable />,
      },
      {
        path: "contexts",
        element: <ContextRulesTable />,
      },
      {
        path: "templates",
        element: <PromptTemplatesTable />,
      },
      {
        path: "formats",
        element: <ResponseFormatsTable />,
      },
    ],
  },
]);

const Routes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default Routes;
