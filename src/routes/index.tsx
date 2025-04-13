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
const FollowUpQuestionsTable = lazy(
  () => import("@/components/admin/FollowUpQuestionsTable"),
);
const WidgetConfig = lazy(() => import("@/components/admin/WidgetConfig"));
const AIConfiguration = lazy(
  () => import("@/components/admin/AIConfiguration"),
);
const AILogs = lazy(() => import("@/components/admin/AILogs"));
const EmbedCode = lazy(() => import("@/components/admin/EmbedCode"));

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
      {
        path: "followups",
        element: <FollowUpQuestionsTable />,
      },
      {
        path: "widget-config",
        element: <WidgetConfig />,
      },
      {
        path: "ai-configuration",
        element: <AIConfiguration />,
      },
      {
        path: "ai-logs",
        element: <AILogs />,
      },
      {
        path: "embed-code",
        element: <EmbedCode />,
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
