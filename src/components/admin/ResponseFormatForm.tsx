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

interface ResponseFormatFormProps {
  initialData?: ResponseFormat;
  onSubmit: (data: ResponseFormatFormData) => void;
  onCancel: () => void;
}

interface ResponseFormatFormData {
  name: string;
  businessContext: string;
  description?: string;
  formatSchema: any;
  isDefault: boolean;
  isActive: boolean;
}

interface ResponseFormat extends ResponseFormatFormData {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

const ResponseFormatForm = ({
  initialData,
  onSubmit,
  onCancel,
}: ResponseFormatFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [schemaError, setSchemaError] = useState<string | null>(null);

  const defaultSchema = {
    title: "AI Assistant Response",
    intro: "Here's what I found for you:",
    content_blocks: [],
    faq: [],
    actions: [],
    disclaimer: "This information is provided for general guidance only.",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ResponseFormatFormData>({
    defaultValues: initialData || {
      name: "",
      businessContext: "general",
      description: "",
      formatSchema: defaultSchema,
      isDefault: false,
      isActive: true,
    },
  });

  const isActive = watch("isActive");
  const isDefault = watch("isDefault");
  const formatSchema = watch("formatSchema");

  const validateSchema = (schema: string): boolean => {
    try {
      JSON.parse(schema);
      setSchemaError(null);
      return true;
    } catch (error) {
      setSchemaError("Invalid JSON format");
      return false;
    }
  };

  const handleFormSubmit = async (data: ResponseFormatFormData) => {
    setIsSubmitting(true);
    try {
      // Parse the schema if it's a string
      if (typeof data.formatSchema === "string") {
        if (!validateSchema(data.formatSchema)) {
          setIsSubmitting(false);
          return;
        }
        data.formatSchema = JSON.parse(data.formatSchema);
      }

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
          {initialData ? "Edit Response Format" : "Create Response Format"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Format Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
              placeholder="e.g., Standard Response Format"
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
              placeholder="Brief description of this format's purpose"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="formatSchema">Format Schema (JSON)</Label>
            <Textarea
              id="formatSchema"
              {...register("formatSchema", {
                required: "Format schema is required",
                validate: (value) => {
                  if (typeof value === "string") {
                    return validateSchema(value) || "Invalid JSON format";
                  }
                  return true;
                },
              })}
              placeholder={JSON.stringify(defaultSchema, null, 2)}
              rows={10}
              value={
                typeof formatSchema === "object"
                  ? JSON.stringify(formatSchema, null, 2)
                  : formatSchema
              }
              onChange={(e) => {
                setValue("formatSchema", e.target.value);
                validateSchema(e.target.value);
              }}
            />
            {(errors.formatSchema || schemaError) && (
              <p className="text-sm text-destructive">
                {errors.formatSchema?.message || schemaError}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Define the structure of your response format in JSON. Include
              fields like title, intro, content_blocks, faq, actions, and
              disclaimer.
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

export default ResponseFormatForm;
