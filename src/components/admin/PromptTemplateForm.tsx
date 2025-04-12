import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PromptTemplateFormProps {
  initialData?: PromptTemplate;
  onSubmit: (data: PromptTemplateFormData) => void;
  onCancel: () => void;
}

interface PromptTemplateFormData {
  name: string;
  businessContext: string;
  template: string;
  description?: string;
  isDefault: boolean;
  isActive: boolean;
}

interface PromptTemplate extends PromptTemplateFormData {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

const PromptTemplateForm = ({
  initialData,
  onSubmit,
  onCancel,
}: PromptTemplateFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PromptTemplateFormData>({
    defaultValues: initialData || {
      name: "",
      businessContext: "general",
      template:
        "You are an AI assistant specialized in {{businessContext}}. Please provide information about the following query: {{message}}",
      description: "",
      isDefault: false,
      isActive: true,
    },
  });

  const isActive = watch("isActive");
  const isDefault = watch("isDefault");

  const handleFormSubmit = async (data: PromptTemplateFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>
          {initialData ? "Edit Prompt Template" : "Create Prompt Template"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
              placeholder="e.g., General Assistant"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessContext">Business Context</Label>
            <Input
              id="businessContext"
              {...register("businessContext", {
                required: "Business context is required",
              })}
              placeholder="e.g., general, uae-government, customer-support"
            />
            {errors.businessContext && (
              <p className="text-sm text-destructive">
                {errors.businessContext.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Brief description of this template's purpose"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template">Prompt Template</Label>
            <Textarea
              id="template"
              {...register("template", {
                required: "Template is required",
              })}
              placeholder="You are an AI assistant specialized in {{businessContext}}. Please provide information about the following query: {{message}}"
              rows={5}
            />
            {errors.template && (
              <p className="text-sm text-destructive">
                {errors.template.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Use {{ message }} to include the user's message and
              {{ businessContext }} for the business context
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isDefault"
              checked={isDefault}
              onCheckedChange={(checked) => setValue("isDefault", checked)}
            />
            <Label htmlFor="isDefault">
              Set as Default for this Business Context
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData ? "Update" : "Create"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PromptTemplateForm;
