import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ContextRuleFormProps {
  initialData?: ContextRule;
  onSubmit: (data: ContextRuleFormData) => void;
  onCancel: () => void;
}

interface ContextRuleFormData {
  name: string;
  businessContext: string;
  allowedTopics: string;
  restrictedTopics: string;
  aiModel: "gemini" | "huggingface" | "grok";
  promptTemplate: string;
  isActive: boolean;
}

interface ContextRule
  extends Omit<ContextRuleFormData, "allowedTopics" | "restrictedTopics"> {
  id?: string;
  allowedTopics: string[];
  restrictedTopics: string[];
}

const ContextRuleForm = ({
  initialData,
  onSubmit,
  onCancel,
}: ContextRuleFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ContextRuleFormData>({
    defaultValues: initialData
      ? {
          ...initialData,
          allowedTopics: initialData.allowedTopics.join("\n"),
          restrictedTopics: initialData.restrictedTopics.join("\n"),
        }
      : {
          name: "",
          businessContext: "general",
          allowedTopics: "",
          restrictedTopics: "",
          aiModel: "gemini",
          promptTemplate:
            "You are an AI assistant specialized in {{businessContext}}. Please provide information about the following query: {{message}}",
          isActive: true,
        },
  });

  const isActive = watch("isActive");
  const aiModel = watch("aiModel");

  const handleFormSubmit = async (data: ContextRuleFormData) => {
    setIsSubmitting(true);
    try {
      // Convert newline-separated topics to arrays
      const formattedData = {
        ...data,
        allowedTopics: data.allowedTopics.split("\n").filter(Boolean),
        restrictedTopics: data.restrictedTopics.split("\n").filter(Boolean),
      };

      await onSubmit(formattedData);
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
          {initialData ? "Edit Context Rule" : "Create Context Rule"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Rule Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
              placeholder="e.g., UAE Government Information"
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
              placeholder="e.g., uae-government"
            />
            {errors.businessContext && (
              <p className="text-sm text-destructive">
                {errors.businessContext.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="allowedTopics">
                Allowed Topics (one per line)
              </Label>
              <Textarea
                id="allowedTopics"
                {...register("allowedTopics")}
                placeholder="tourism\nculture\nhistory"
                rows={5}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to allow all non-restricted topics
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="restrictedTopics">
                Restricted Topics (one per line)
              </Label>
              <Textarea
                id="restrictedTopics"
                {...register("restrictedTopics")}
                placeholder="politics\nreligion\ncontroversial"
                rows={5}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="aiModel">AI Model</Label>
            <Select
              value={aiModel}
              onValueChange={(value) =>
                setValue("aiModel", value as "gemini" | "huggingface" | "grok")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select AI Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">Gemini</SelectItem>
                <SelectItem value="huggingface">Hugging Face</SelectItem>
                <SelectItem value="grok">Grok</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="promptTemplate">Prompt Template</Label>
            <Textarea
              id="promptTemplate"
              {...register("promptTemplate")}
              placeholder="You are an AI assistant specialized in {{businessContext}}. Please provide information about the following query: {{message}}"
              rows={5}
            />
            <p className="text-xs text-muted-foreground">
              Use {{ message }} to include the user's message and
              {{ businessContext }} for the business context
            </p>
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

export default ContextRuleForm;
