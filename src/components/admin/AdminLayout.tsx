import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Users,
  MessageSquare,
  Settings,
  BarChart,
  FileText,
  Globe,
  Database,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <BarChart size={20} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
    {
      name: "Chat Sessions",
      path: "/admin/sessions",
      icon: <MessageSquare size={20} />,
    },
    {
      name: "Context Rules",
      path: "/admin/contexts",
      icon: <Globe size={20} />,
    },
    {
      name: "Prompt Templates",
      path: "/admin/templates",
      icon: <FileText size={20} />,
    },
    {
      name: "Response Formats",
      path: "/admin/formats",
      icon: <FileText size={20} />,
    },
    {
      name: "Knowledge Base",
      path: "/admin/knowledge",
      icon: <Database size={20} />,
    },
    {
      name: "Follow-up Questions",
      path: "/admin/followups",
      icon: <MessageSquare size={20} />,
    },
    { name: "Settings", path: "/admin/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card text-card-foreground border-r">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Chat Admin</h1>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button className="flex items-center gap-3 px-3 py-2 w-full rounded-md hover:bg-muted transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-card text-card-foreground p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {navItems.find((item) => item.path === location.pathname)?.name ||
                "Admin Panel"}
            </h2>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
