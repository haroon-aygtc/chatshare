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
import PromptTemplateForm from "./PromptTemplateForm";
import { adminApi } from "@/services/api";

interface PromptTemplate {
  id: string;
  name: string;
  template: string;
  description?: string;
  businessContext: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const PromptTemplatesTable = () => {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTemplate, setSelectedTemplate] =
    useState<PromptTemplate | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, [page]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch from the API
      // For now, we'll use mock data until the backend is fully implemented
      const mockData = {
        templates: [
          {
            id: "1",
            name: "General Assistant",
            template:
              "You are an AI assistant specialized in {{businessContext}}. Please provide information about the following query: {{message}}",
            description: "Default template for general inquiries",
            businessContext: "general",
            isDefault: true,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "2",
            name: "UAE Government Information",
            template:
              "You are an official AI assistant for the UAE government. Please provide accurate information about the following query related to UAE government services: {{message}}",
            description: "Template for UAE government inquiries",
            businessContext: "uae-government",
            isDefault: true,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "3",
            name: "Customer Support",
            template:
              "You are a customer support AI assistant. Please help with the following customer query: {{message}}",
            description: "Template for customer support inquiries",
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
      // const data = await adminApi.getPromptTemplates(page, 10);
      // setTemplates(data.templates);
      // setTotalPages(data.pagination.pages);

      setTemplates(mockData.templates);
      setTotalPages(mockData.pagination.pages);
      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch prompt templates",
      );
      setLoading(false);
      console.error("Error fetching prompt templates:", err);
    }
  };

  const handleToggleActive = async (template: PromptTemplate) => {
    try {
      // In a real implementation, this would update the template via API
      // await adminApi.updatePromptTemplate(template.id, { ...template, isActive: !template.isActive });

      // Update the template in the list
      setTemplates(
        templates.map((t) =>
          t.id === template.id ? { ...t, isActive: !t.isActive } : t,
        ),
      );
    } catch (err) {
      console.error("Error updating prompt template:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update prompt template",
      );
    }
  };

  const handleToggleDefault = async (template: PromptTemplate) => {
    try {
      if (template.isDefault) {
        // Cannot unset a default template directly
        return;
      }

      // In a real implementation, this would update the template via API
      // await adminApi.updatePromptTemplate(template.id, { ...template, isDefault: true });

      // Update the templates in the list - set this one as default and others with same business context as non-default
      setTemplates(
        templates.map((t) =>
          t.businessContext === template.businessContext
            ? { ...t, isDefault: t.id === template.id }
            : t,
        ),
      );
    } catch (err) {
      console.error("Error updating prompt template:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update prompt template",
      );
    }
  };

  const handleDeleteTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      // In a real implementation, this would delete the template via API
      // await adminApi.deletePromptTemplate(selectedTemplate.id);

      // Remove template from the list
      setTemplates(
        templates.filter((template) => template.id !== selectedTemplate.id),
      );
      setIsDeleteDialogOpen(false);
      setSelectedTemplate(null);
    } catch (err) {
      console.error("Error deleting prompt template:", err);
      setError(
        err instanceof Error ? err.message : "Failed to delete prompt template",
      );
    }
  };

  const handleSubmitForm = async (formData: any) => {
    try {
      if (selectedTemplate) {
        // Update existing template
        // In a real implementation, this would update the template via API
        // const data = await adminApi.updatePromptTemplate(selectedTemplate.id, formData);

        // Update the template in the list
        setTemplates(
          templates.map((template) =>
            template.id === selectedTemplate.id
              ? {
                  ...template,
                  ...formData,
                  updatedAt: new Date().toISOString(),
                }
              : template,
          ),
        );
      } else {
        // Create new template
        // In a real implementation, this would create the template via API
        // const data = await adminApi.createPromptTemplate(formData);

        // Add the new template to the list
        const newTemplate = {
          id: `new-${Date.now()}`,
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setTemplates([newTemplate, ...templates]);
      }

      setIsFormDialogOpen(false);
      setSelectedTemplate(null);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err instanceof Error ? err.message : "Failed to submit form");
    }
  };

  if (loading && templates.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading prompt templates...
      </div>
    );
  }

  if (error && templates.length === 0) {
    return <div className="text-destructive p-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setSelectedTemplate(null);
            setIsFormDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Prompt Template
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
            {templates.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No prompt templates found
                </TableCell>
              </TableRow>
            ) : (
              templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>{template.businessContext}</TableCell>
                  <TableCell>
                    <Switch
                      checked={template.isDefault}
                      onCheckedChange={() => handleToggleDefault(template)}
                      disabled={template.isDefault}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={template.isActive}
                      onCheckedChange={() => handleToggleActive(template)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setIsFormDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedTemplate(template);
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
              prompt template
              {selectedTemplate && ` "${selectedTemplate.name}"`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTemplate}
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
              {selectedTemplate
                ? "Edit Prompt Template"
                : "Create Prompt Template"}
            </DialogTitle>
          </DialogHeader>
          <PromptTemplateForm
            initialData={selectedTemplate || undefined}
            onSubmit={handleSubmitForm}
            onCancel={() => setIsFormDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Prompt Template Details</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Name</h3>
                  <p>{selectedTemplate.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Business Context</h3>
                  <p>{selectedTemplate.businessContext}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Default</h3>
                  <p>{selectedTemplate.isDefault ? "Yes" : "No"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Status</h3>
                  <p>{selectedTemplate.isActive ? "Active" : "Inactive"}</p>
                </div>
              </div>

              {selectedTemplate.description && (
                <div>
                  <h3 className="text-sm font-medium">Description</h3>
                  <p>{selectedTemplate.description}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium">Template</h3>
                <pre className="mt-1 p-2 bg-muted rounded-md whitespace-pre-wrap text-sm">
                  {selectedTemplate.template}
                </pre>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <span>
                    Created:{" "}
                    {new Date(selectedTemplate.createdAt).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span>
                    Last Updated:{" "}
                    {new Date(selectedTemplate.updatedAt).toLocaleString()}
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

export default PromptTemplatesTable;
