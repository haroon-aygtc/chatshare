import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import ContextRuleForm from "./ContextRuleForm";

interface ContextRule {
  id: string;
  name: string;
  businessContext: string;
  allowedTopics: string[];
  restrictedTopics: string[];
  aiModel: "gemini" | "huggingface" | "grok";
  promptTemplate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const ContextRulesTable = () => {
  const [contextRules, setContextRules] = useState<ContextRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRule, setSelectedRule] = useState<ContextRule | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    fetchContextRules();
  }, [page]);

  const fetchContextRules = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`/api/contexts?page=${page}&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch context rules");
      }

      const data = await response.json();
      setContextRules(data.contextRules);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch context rules",
      );
      setLoading(false);
      console.error("Error fetching context rules:", err);
    }
  };

  const handleToggleActive = async (rule: ContextRule) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`/api/contexts/${rule.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...rule, isActive: !rule.isActive }),
      });

      if (!response.ok) {
        throw new Error("Failed to update context rule");
      }

      // Update the rule in the list
      setContextRules(
        contextRules.map((r) =>
          r.id === rule.id ? { ...r, isActive: !r.isActive } : r,
        ),
      );
    } catch (err) {
      console.error("Error updating context rule:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update context rule",
      );
    }
  };

  const handleDeleteRule = async () => {
    if (!selectedRule) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`/api/contexts/${selectedRule.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete context rule");
      }

      // Remove rule from the list
      setContextRules(
        contextRules.filter((rule) => rule.id !== selectedRule.id),
      );
      setIsDeleteDialogOpen(false);
      setSelectedRule(null);
    } catch (err) {
      console.error("Error deleting context rule:", err);
      setError(
        err instanceof Error ? err.message : "Failed to delete context rule",
      );
    }
  };

  const handleSubmitForm = async (formData: any) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const method = selectedRule ? "PUT" : "POST";
      const url = selectedRule
        ? `/api/contexts/${selectedRule.id}`
        : "/api/contexts";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${selectedRule ? "update" : "create"} context rule`,
        );
      }

      const data = await response.json();

      if (selectedRule) {
        // Update the rule in the list
        setContextRules(
          contextRules.map((rule) =>
            rule.id === selectedRule.id ? data.contextRule : rule,
          ),
        );
      } else {
        // Add the new rule to the list
        setContextRules([data.contextRule, ...contextRules]);
      }

      setIsFormDialogOpen(false);
      setSelectedRule(null);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err instanceof Error ? err.message : "Failed to submit form");
    }
  };

  if (loading && contextRules.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading context rules...
      </div>
    );
  }

  if (error && contextRules.length === 0) {
    return <div className="text-destructive p-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setSelectedRule(null);
            setIsFormDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Context Rule
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Business Context</TableHead>
              <TableHead>AI Model</TableHead>
              <TableHead>Topics</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contextRules.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No context rules found
                </TableCell>
              </TableRow>
            ) : (
              contextRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>{rule.businessContext}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs bg-muted">
                      {rule.aiModel}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        {rule.allowedTopics.length} allowed,{" "}
                        {rule.restrictedTopics.length} restricted
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={() => handleToggleActive(rule)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedRule(rule);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedRule(rule);
                          setIsFormDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedRule(rule);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              context rule
              {selectedRule && ` "${selectedRule.name}"`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRule}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create/Edit Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedRule ? "Edit Context Rule" : "Create Context Rule"}
            </DialogTitle>
          </DialogHeader>
          <ContextRuleForm
            initialData={selectedRule || undefined}
            onSubmit={handleSubmitForm}
            onCancel={() => setIsFormDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Context Rule Details</DialogTitle>
          </DialogHeader>
          {selectedRule && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Name</h3>
                  <p>{selectedRule.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Business Context</h3>
                  <p>{selectedRule.businessContext}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">AI Model</h3>
                  <p>{selectedRule.aiModel}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Status</h3>
                  <p>{selectedRule.isActive ? "Active" : "Inactive"}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium">Prompt Template</h3>
                <pre className="mt-1 p-2 bg-muted rounded-md whitespace-pre-wrap text-sm">
                  {selectedRule.promptTemplate}
                </pre>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Allowed Topics</h3>
                  {selectedRule.allowedTopics.length > 0 ? (
                    <ul className="mt-1 list-disc list-inside">
                      {selectedRule.allowedTopics.map((topic, index) => (
                        <li key={index} className="text-sm">
                          {topic}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No allowed topics specified
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium">Restricted Topics</h3>
                  {selectedRule.restrictedTopics.length > 0 ? (
                    <ul className="mt-1 list-disc list-inside">
                      {selectedRule.restrictedTopics.map((topic, index) => (
                        <li key={index} className="text-sm">
                          {topic}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No restricted topics specified
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <span>
                    Created: {new Date(selectedRule.createdAt).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span>
                    Last Updated:{" "}
                    {new Date(selectedRule.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContextRulesTable;
