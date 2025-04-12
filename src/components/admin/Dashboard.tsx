import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, Globe, FileText } from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalSessions: number;
  totalMessages: number;
  activeContextRules: number;
  messagesByDay: { date: string; count: number }[];
  messagesByRole: { user: number; assistant: number };
  messagesByBusinessContext: { businessContext: string; count: number }[];
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real implementation, this would fetch from the API
        // For now, we'll use mock data
        const mockStats: DashboardStats = {
          totalUsers: 120,
          totalSessions: 450,
          totalMessages: 2345,
          activeContextRules: 8,
          messagesByDay: [
            { date: "2023-06-01", count: 120 },
            { date: "2023-06-02", count: 145 },
            { date: "2023-06-03", count: 132 },
            { date: "2023-06-04", count: 167 },
            { date: "2023-06-05", count: 189 },
            { date: "2023-06-06", count: 212 },
            { date: "2023-06-07", count: 198 },
          ],
          messagesByRole: { user: 1172, assistant: 1173 },
          messagesByBusinessContext: [
            { businessContext: "general", count: 1200 },
            { businessContext: "uae-government", count: 645 },
            { businessContext: "customer-support", count: 500 },
          ],
        };

        setStats(mockStats);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch dashboard statistics");
        setLoading(false);
        console.error("Error fetching dashboard stats:", err);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chat Sessions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSessions}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Context Rules
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.activeContextRules}
            </div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Messages by Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              {/* In a real implementation, this would be a chart */}
              <div className="flex h-full items-end gap-2">
                {stats?.messagesByDay.map((day) => (
                  <div key={day.date} className="flex flex-col items-center">
                    <div
                      className="bg-primary w-10"
                      style={{ height: `${(day.count / 250) * 100}%` }}
                    />
                    <span className="text-xs mt-2">
                      {new Date(day.date).toLocaleDateString(undefined, {
                        weekday: "short",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Messages by Business Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.messagesByBusinessContext.map((context) => (
                <div key={context.businessContext} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {context.businessContext}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {context.count}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${(context.count / stats.totalMessages) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
