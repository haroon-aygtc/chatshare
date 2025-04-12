import PromptTemplateForm from "@/components/admin/PromptTemplateForm";

export default function PromptTemplateFormStoryboard() {
  return (
    <div className="bg-background p-6">
      <PromptTemplateForm
        onSubmit={(data) => console.log("Form submitted:", data)}
        onCancel={() => console.log("Form cancelled")}
      />
    </div>
  );
}
