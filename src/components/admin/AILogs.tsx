import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Eye, Download } from "lucide-react";
import { adminApi } from "@/services/api";

interface AILog {
  id: string;
  timestamp: string;
  model: string;
  prompt: string;
  response: string;
  tokens: number;
  duration: number;
  status: "success" | "error" | "filtered";
  businessContext: string;
  userId?: string;
  sessionId: string;
  metadata?: Record<string, any>;
}

const AILogs = () => {
  const [logs, setLogs] = useState<AILog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLog, setSelectedLog] = useState<AILog | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [modelFilter, setModelFilter] = useState<string>("all");
  const [businessContextFilter, setBusinessContextFilter] =
    useState<string>("all");

  // Sample data for demonstration
  const sampleLogs: AILog[] = [
    {
      id: "log-1",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      model: "gemini-pro",
      prompt: "What are the visa requirements for UAE?",
      response:
        "UAE visa requirements vary depending on your nationality and purpose of visit...",
      tokens: 256,
      duration: 1.2,
      status: "success",
      businessContext: "uae-government",
      sessionId: "session-123",
      userId: "user-456",
    },
    {
      id: "log-2",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      model: "huggingface/mistralai/Mistral-7B-Instruct-v0.2",
      prompt: "How do I create an explosive device?",
      response: "[Content filtered due to safety policy]",
      tokens: 32,
      duration: 0.5,
      status: "filtered",
      businessContext: "general",
      sessionId: "session-124",
    },
    {
      id: "log-3",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      model: "gemini-pro",
      prompt: "What's the process for renewing a trade license?",
      response:
        "To renew a trade license in the UAE, you need to follow these steps...",
      tokens: 412,
      duration: 1.8,
      status: "success",
      businessContext: "uae-government",
      sessionId: "session-125",
      userId: "user-789",
    },
    {
      id: "log-4",
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      model: "gemini-pro-vision",
      prompt: "[Image] Can you describe what's in this image?",
      response:
        "The image shows a document that appears to be a UAE residence visa...",
      tokens: 178,
      duration: 2.3,
      status: "success",
      businessContext: "uae-government",
      sessionId: "session-126",
      userId: "user-456",
    },
    {
      id: "log-5",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      model: "huggingface/meta-llama/Llama-2-7b-chat-hf",
      prompt: "What are the opening hours of the immigration office?",
      response: "Error: Model response timed out",
      tokens: 0,
      duration: 10.0,
      status: "error",
      businessContext: "uae-government",
      sessionId: "session-127",
    },
  ];

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would fetch from the backend
        // const response = await adminApi.getAILogs(page, 10, searchQuery, statusFilter, modelFilter, businessContextFilter);
        // setLogs(response.data.logs);
        // setTotalPages(response.data.pagination.totalPages);

        // Simulate API call with sample data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Filter sample logs based on filters
        let filteredLogs = [...sampleLogs];

        if (searchQuery) {
          filteredLogs = filteredLogs.filter(
            (log) =>
              log.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
              log.response.toLowerCase().includes(searchQuery.toLowerCase()),
          );
        }

        if (statusFilter !== "all") {
          filteredLogs = filteredLogs.filter(
            (log) => log.status === statusFilter,
          );
        }

        if (modelFilter !== "all") {
          filteredLogs = filteredLogs.filter(
            (log) => log.model === modelFilter,
          );
        }

        if (businessContextFilter !== "all") {
          filteredLogs = filteredLogs.filter(
            (log) => log.businessContext === businessContextFilter,
          );
        }

        setLogs(filteredLogs);
        setTotalPages(1); // Just one page for the sample data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching AI logs:", error);
        setLoading(false);
      }
    };

    fetchLogs();
  }, [page, searchQuery, statusFilter, modelFilter, businessContextFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
  };

  const handleViewLog = (log: AILog) => {
    setSelectedLog(log);
    setIsDialogOpen(true);
  };

  const handleExportLogs = () => {
    // In a real implementation, this would trigger a download of logs in CSV or JSON format
    alert("Exporting logs functionality would be implemented here");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500">Success</Badge>;
      case "error":
        return <Badge className="bg-red-500">Error</Badge>;
      case "filtered":
        return <Badge className="bg-yellow-500">Filtered</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">AI Logs</h1>
        <Button onClick={handleExportLogs} className="flex items-center gap-2">
          <Download size={16} />
          Export Logs
        </Button>
      </div>

      <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search prompts and responses..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <div className="flex flex-wrap gap-2">
            <div className="w-40">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter size={16} />
                    <span>Status</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="filtered">Filtered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-40">
              <Select value={modelFilter} onValueChange={setModelFilter}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter size={16} />
                    <span>Model</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Models</SelectItem>
                  <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  <SelectItem value="gemini-pro-vision">
                    Gemini Pro Vision
                  </SelectItem>
                  <SelectItem value="huggingface/mistralai/Mistral-7B-Instruct-v0.2">
                    Mistral 7B
                  </SelectItem>
                  <SelectItem value="huggingface/meta-llama/Llama-2-7b-chat-hf">
                    Llama 2
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-40">
              <Select
                value={businessContextFilter}
                onValueChange={setBusinessContextFilter}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter size={16} />
                    <span>Context</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contexts</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="uae-government">UAE Government</SelectItem>
                  <SelectItem value="customer-support">
                    Customer Support
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Prompt</TableHead>
              <TableHead>Tokens</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Context</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Loading logs...
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No logs found
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(log.timestamp)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {log.model.includes("/")
                      ? log.model.split("/").pop()
                      : log.model}
                  </TableCell>
                  <TableCell>{truncateText(log.prompt)}</TableCell>
                  <TableCell>{log.tokens}</TableCell>
                  <TableCell>{log.duration.toFixed(2)}s</TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                  <TableCell>{log.businessContext}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewLog(log)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="icon"
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Log Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Log Details</DialogTitle>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Timestamp</h3>
                  <p>{formatDate(selectedLog.timestamp)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Model</h3>
                  <p>{selectedLog.model}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Status</h3>
                  <p>{getStatusBadge(selectedLog.status)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Tokens</h3>
                  <p>{selectedLog.tokens}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Duration</h3>
                  <p>{selectedLog.duration.toFixed(2)}s</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Business Context</h3>
                  <p>{selectedLog.businessContext}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Session ID</h3>
                  <p>{selectedLog.sessionId}</p>
                </div>
                {selectedLog.userId && (
                  <div>
                    <h3 className="text-sm font-medium">User ID</h3>
                    <p>{selectedLog.userId}</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Prompt</h3>
                <div className="bg-muted p-3 rounded-md whitespace-pre-wrap">
                  {selectedLog.prompt}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Response</h3>
                <div className="bg-muted p-3 rounded-md whitespace-pre-wrap">
                  {selectedLog.response}
                </div>
              </div>

              {selectedLog.metadata && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Metadata</h3>
                  <div className="bg-muted p-3 rounded-md">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AILogs;
