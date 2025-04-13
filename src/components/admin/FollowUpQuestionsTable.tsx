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
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import FollowUpQuestionForm from "./FollowUpQuestionForm";
import { adminApi } from "@/services/api";

interface FollowUpQuestion {
  id: string;
  question: string;
  businessContext: string;
  isMultiSelect: boolean;
  position: "top" | "bottom";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const FollowUpQuestionsTable = () => {
  const [followUps, setFollowUps] = useState<FollowUpQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFollowUp, setSelectedFollowUp] =
    useState<FollowUpQuestion | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);

  useEffect(() => {
    fetchFollowUps();
  }, [page]);

  const fetchFollowUps = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch from the API
      // For now, we'll use mock data until the backend is fully implemented
      const mockData = {
        followUps: [
          {
            id: "1",
            question: "What documents do I need for a tourist visa?",
            businessContext: "uae-government",
            isMultiSelect: false,
            position: "bottom",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "2",
            question: "How much does a UAE visa cost?",
            businessContext: "uae-government",
            isMultiSelect: false,
            position: "bottom",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "3",
            question: "How long does visa processing take?",
            businessContext: "uae-government",
            isMultiSelect: false,
            position: "bottom",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        pagination: {
          total: 3,
          page: 1,
          limit: 10,
          pages: 1,
        },
      };

      // When backend is ready, use this instead:
      // const data = await adminApi.getFollowUpQuestions(page, 10);
      // setFollowUps(data.followUps);
      // setTotalPages(data.pagination.pages);

      setFollowUps(mockData.followUps);
      setTotalPages(mockData.pagination.pages);
      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch follow-up questions",
      );
      setLoading(false);
      console.error("Error fetching follow-up questions:", err);
    }
  };

  const handleToggleActive = async (followUp: FollowUpQuestion) => {
    try {
      // In a real implementation, this would update the follow-up question via API
      // await adminApi.updateFollowUpQuestion(followUp.id, { ...followUp, isActive: !followUp.isActive });

      // Update the follow-up question in the list
      setFollowUps(
        followUps.map((f) =>
          f.id === followUp.id ? { ...f, isActive: !f.isActive } : f,
        ),
      );
    } catch (err) {
      console.error("Error updating follow-up question:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update follow-up question",
      );
    }
  };

  const handleDeleteFollowUp = async () => {
    if (!selectedFollowUp) return;

    try {
      // In a real implementation, this would delete the follow-up question via API
      // await adminApi.deleteFollowUpQuestion(selectedFollowUp.id);

      // Remove follow-up question from the list
      setFollowUps(
        followUps.filter((followUp) => followUp.id !== selectedFollowUp.id),
      );
      setIsDeleteDialogOpen(false);
      setSelectedFollowUp(null);
    } catch (err) {
      console.error("Error deleting follow-up question:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete follow-up question",
      );
    }
  };

  const handleSubmitForm = async (formData: any) => {
    try {
      if (selectedFollowUp) {
        // Update existing follow-up question
        // In a real implementation, this would update the follow-up question via API
        // const data = await adminApi.updateFollowUpQuestion(selectedFollowUp.id, formData);

        // Update the follow-up question in the list
        setFollowUps(
          followUps.map((followUp) =>
            followUp.id === selectedFollowUp.id
              ? {
                  ...followUp,
                  ...formData,
                  updatedAt: new Date().toISOString(),
                }
              : followUp,
          ),
        );
      } else {
        // Create new follow-up question
        // In a real implementation, this would create the follow-up question via API
        // const data = await adminApi.createFollowUpQuestion(formData);

        // Add the new follow-up question to the list
        const newFollowUp = {
          id: `new-${Date.now()}`,
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setFollowUps([newFollowUp, ...followUps]);
      }

      setIsFormDialogOpen(false);
      setSelectedFollowUp(null);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err instanceof Error ? err.message : "Failed to submit form");
    }
  };

  if (loading && followUps.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading follow-up questions...
      </div>
    );
  }

  if (error && followUps.length === 0) {
    return <div className="text-destructive p-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setSelectedFollowUp(null);
            setIsFormDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Follow-Up Question
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Business Context</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Multi-Select</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {followUps.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No follow-up questions found
                </TableCell>
              </TableRow>
            ) : (
              followUps.map((followUp) => (
                <TableRow key={followUp.id}>
                  <TableCell className="font-medium">
                    {followUp.question}
                  </TableCell>
                  <TableCell>{followUp.businessContext}</TableCell>
                  <TableCell className="capitalize">
                    {followUp.position}
                  </TableCell>
                  <TableCell>{followUp.isMultiSelect ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <Switch
                      checked={followUp.isActive}
                      onCheckedChange={() => handleToggleActive(followUp)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedFollowUp(followUp);
                          setIsFormDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedFollowUp(followUp);
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
              follow-up question
              {selectedFollowUp && ` "${selectedFollowUp.question}"`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFollowUp}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create/Edit Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedFollowUp
                ? "Edit Follow-Up Question"
                : "Create Follow-Up Question"}
            </DialogTitle>
          </DialogHeader>
          <FollowUpQuestionForm
            initialData={selectedFollowUp || undefined}
            onSubmit={handleSubmitForm}
            onCancel={() => setIsFormDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FollowUpQuestionsTable;
