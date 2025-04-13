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
import ResponseFormatForm from "./ResponseFormatForm";
import { adminApi } from "@/services/api";

interface ResponseFormat {
  id: string;
  name: string;
  description?: string;
  formatSchema: any;
  businessContext: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const ResponseFormatsTable = () => {
  const [formats, setFormats] = useState<ResponseFormat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState<ResponseFormat | null>(
    null,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    fetchFormats();
  }, [page]);

  const fetchFormats = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch from the API
      // For now, we'll use mock data until the backend is fully implemented
      const mockData = {
        formats: [
          {
            id: "1",
            name: "Standard Response Format",
            description: "Default format for general responses",
            formatSchema: {
              title: "AI Assistant Response",
              intro: "Here's what I found for you:",
              content_blocks: [],
              faq: [],
              actions: [],
              disclaimer:
                "This information is provided for general guidance only.",
            },
            businessContext: "general",
            isDefault: true,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "2",
            name: "UAE Government Format",
            description: "Format for UAE government responses",
            formatSchema: {
              title: "UAE Government Information",
              intro: "Official information from the UAE Government:",
              content_blocks: [],
              faq: [],
              actions: [],
              disclaimer:
                "This information is provided by the UAE Government for guidance purposes.",
            },
            businessContext: "uae-government",
            isDefault: true,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "3",
            name: "Customer Support Format",
            description: "Format for customer support responses",
            formatSchema: {
              title: "Customer Support",
              intro: "Thank you for contacting our support team.",
              content_blocks: [],
              faq: [],
              actions: [],
              disclaimer:
                "If you need further assistance, please contact our support team.",
            },
            businessContext: "customer-support",
            isDefault: true,
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
      // const data = await adminApi.getResponseFormats(page, 10);
      // setFormats(data.formats);
      // setTotalPages(data.pagination.pages);

      setFormats(mockData.formats);
      setTotalPages(mockData.pagination.pages);
      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch response formats",
      );
      setLoading(false);
      console.error("Error fetching response formats:", err);
    }
  };

  const handleToggleActive = async (format: ResponseFormat) => {
    try {
      // In a real implementation, this would update the format via API
      // await adminApi.updateResponseFormat(format.id, { ...format, isActive: !format.isActive });

      // Update the format in the list
      setFormats(
        formats.map((f) =>
          f.id === format.id ? { ...f, isActive: !f.isActive } : f,
        ),
      );
    } catch (err) {
      console.error("Error updating response format:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update response format",
      );
    }
  };

  const handleToggleDefault = async (format: ResponseFormat) => {
    try {
      if (format.isDefault) {
        // Cannot unset a default format directly
        return;
      }

      // In a real implementation, this would update the format via API
      // await adminApi.updateResponseFormat(format.id, { ...format, isDefault: true });

      // Update the formats in the list - set this one as default and others with same business context as non-default
      setFormats(
        formats.map((f) =>
          f.businessContext === format.businessContext
            ? { ...f, isDefault: f.id === format.id }
            : f,
        ),
      );
    } catch (err) {
      console.error("Error updating response format:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update response format",
      );
    }
  };

  const handleDeleteFormat = async () => {
    if (!selectedFormat) return;

    try {
      // In a real implementation, this would delete the format via API
      // await adminApi.deleteResponseFormat(selectedFormat.id);

      // Remove format from the list
      setFormats(formats.filter((format) => format.id !== selectedFormat.id));
      setIsDeleteDialogOpen(false);
      setSelectedFormat(null);
    } catch (err) {
      console.error("Error deleting response format:", err);
      setError(
        err instanceof Error ? err.message : "Failed to delete response format",
      );
    }
  };

  const handleSubmitForm = async (formData: any) => {
    try {
      if (selectedFormat) {
        // Update existing format
        // In a real implementation, this would update the format via API
        // const data = await adminApi.updateResponseFormat(selectedFormat.id, formData);

        // Update the format in the list
        setFormats(
          formats.map((format) =>
            format.id === selectedFormat.id
              ? {
                  ...format,
                  ...formData,
                  updatedAt: new Date().toISOString(),
                }
              : format,
          ),
        );
      } else {
        // Create new format
        // In a real implementation, this would create the format via API
        // const data = await adminApi.createResponseFormat(formData);

        // Add the new format to the list
        const newFormat = {
          id: `new-${Date.now()}`,
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setFormats([newFormat, ...formats]);
      }

      setIsFormDialogOpen(false);
      setSelectedFormat(null);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err instanceof Error ? err.message : "Failed to submit form");
    }
  };

  if (loading && formats.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading response formats...
      </div>
    );
  }

  if (error && formats.length === 0) {
    return <div className="text-destructive p-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setSelectedFormat(null);
            setIsFormDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Response Format
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Business Context</TableHead>
              <TableHead>Default</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formats.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No response formats found
                </TableCell>
              </TableRow>
            ) : (
              formats.map((format) => (
                <TableRow key={format.id}>
                  <TableCell className="font-medium">{format.name}</TableCell>
                  <TableCell>{format.businessContext}</TableCell>
                  <TableCell>
                    <Switch
                      checked={format.isDefault}
                      onCheckedChange={() => handleToggleDefault(format)}
                      disabled={format.isDefault}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={format.isActive}
                      onCheckedChange={() => handleToggleActive(format)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedFormat(format);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedFormat(format);
                          setIsFormDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedFormat(format);
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
              response format
              {selectedFormat && ` "${selectedFormat.name}"`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFormat}
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
              {selectedFormat
                ? "Edit Response Format"
                : "Create Response Format"}
            </DialogTitle>
          </DialogHeader>
          <ResponseFormatForm
            initialData={selectedFormat || undefined}
            onSubmit={handleSubmitForm}
            onCancel={() => setIsFormDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Response Format Details</DialogTitle>
          </DialogHeader>
          {selectedFormat && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Name</h3>
                  <p>{selectedFormat.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Business Context</h3>
                  <p>{selectedFormat.businessContext}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Default</h3>
                  <p>{selectedFormat.isDefault ? "Yes" : "No"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Status</h3>
                  <p>{selectedFormat.isActive ? "Active" : "Inactive"}</p>
                </div>
              </div>

              {selectedFormat.description && (
                <div>
                  <h3 className="text-sm font-medium">Description</h3>
                  <p>{selectedFormat.description}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium">Format Schema</h3>
                <pre className="mt-1 p-2 bg-muted rounded-md whitespace-pre-wrap text-sm">
                  {JSON.stringify(selectedFormat.formatSchema, null, 2)}
                </pre>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <span>
                    Created:{" "}
                    {new Date(selectedFormat.createdAt).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span>
                    Last Updated:{" "}
                    {new Date(selectedFormat.updatedAt).toLocaleString()}
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

export default ResponseFormatsTable;
