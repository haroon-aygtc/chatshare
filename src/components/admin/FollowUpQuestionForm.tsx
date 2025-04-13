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

interface FollowUpQuestionFormProps {
  initialData?: FollowUpQuestion;
  onSubmit: (data: FollowUpQuestionFormData) => void;
  onCancel: () => void;
}

interface FollowUpQuestionFormData {
  question: string;
  businessContext: string;
  responseType: "predefined" | "prompt" | "knowledge_base";
  predefinedResponse?: string;
  promptTemplate?: string;
  knowledgeBaseId?: string;
  position: "start" | "end" | "custom";
  customMarker?: string;
  isActive: boolean;
}

interface FollowUpQuestion extends FollowUpQuestionFormData {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

const FollowUpQuestionForm = ({
  initialData,
  onSubmit,
  onCancel,
}: FollowUpQuestionFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FollowUpQuestionFormData>({
    defaultValues: initialData || {
      question: "",
      businessContext: "general",
      responseType: "prompt",
      position: "end",
      isActive: true,
    },
  });

  const isActive = watch("isActive");
  const responseType = watch("responseType");
  const position = watch("position");

  const handleFormSubmit = async (data: FollowUpQuestionFormData) => {
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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="question">Question</Label>
        <Input
          id="question"
          {...register("question", { required: "Question is required" })}
          placeholder="e.g., What documents do I need for a tourist visa?"
        />
        {errors.question && (
          <p className="text-sm text-destructive">{errors.question.message}</p>
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
        <Label htmlFor="responseType">Response Type</Label>
        <Select
          value={responseType}
          onValueChange={(value: "predefined" | "prompt" | "knowledge_base") =>
            setValue("responseType", value)
          }
        >
          <SelectTrigger id="responseType">
            <SelectValue placeholder="Select response type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="predefined">Predefined Response</SelectItem>
            <SelectItem value="prompt">AI Prompt</SelectItem>
            <SelectItem value="knowledge_base">Knowledge Base</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {responseType === "predefined" && (
        <div className="space-y-2">
          <Label htmlFor="predefinedResponse">Predefined Response</Label>
          <Textarea
            id="predefinedResponse"
            {...register("predefinedResponse", {
              required: "Predefined response is required for this type",
            })}
            placeholder="Enter the response text that will be shown when this question is selected"
            rows={3}
          />
          {errors.predefinedResponse && (
            <p className="text-sm text-destructive">
              {errors.predefinedResponse.message}
            </p>
          )}
        </div>
      )}

      {responseType === "prompt" && (
        <div className="space-y-2">
          <Label htmlFor="promptTemplate">Prompt Template</Label>
          <Textarea
            id="promptTemplate"
            {...register("promptTemplate", {
              required: "Prompt template is required for this type",
            })}
            placeholder="Enter the prompt template that will be used to generate a response"
            rows={3}
          />
          {errors.promptTemplate && (
            <p className="text-sm text-destructive">
              {errors.promptTemplate.message}
            </p>
          )}
        </div>
      )}

      {responseType === "knowledge_base" && (
        <div className="space-y-2">
          <Label htmlFor="knowledgeBaseId">Knowledge Base</Label>
          <Input
            id="knowledgeBaseId"
            {...register("knowledgeBaseId", {
              required: "Knowledge base ID is required for this type",
            })}
            placeholder="Enter the knowledge base ID"
          />
          {errors.knowledgeBaseId && (
            <p className="text-sm text-destructive">
              {errors.knowledgeBaseId.message}
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="position">Position</Label>
        <Select
          value={position}
          onValueChange={(value: "start" | "end" | "custom") =>
            setValue("position", value)
          }
        >
          <SelectTrigger id="position">
            <SelectValue placeholder="Select position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="start">Start (Before AI Response)</SelectItem>
            <SelectItem value="end">End (After AI Response)</SelectItem>
            <SelectItem value="custom">Custom Position</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {position === "custom" && (
        <div className="space-y-2">
          <Label htmlFor="customMarker">Custom Marker</Label>
          <Input
            id="customMarker"
            {...register("customMarker", {
              required: "Custom marker is required for custom position",
            })}
            placeholder="Enter a marker to indicate where to place the follow-up questions"
          />
          {errors.customMarker && (
            <p className="text-sm text-destructive">
              {errors.customMarker.message}
            </p>
          )}
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={isActive}
          onCheckedChange={(checked) => setValue("isActive", checked)}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default FollowUpQuestionForm;
