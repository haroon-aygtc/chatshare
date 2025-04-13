import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { adminApi } from "@/services/api";

const AIConfiguration = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [config, setConfig] = useState({
    models: {
      primary: "gemini-pro",
      fallback: "huggingface/mistralai/Mistral-7B-Instruct-v0.2",
      useHuggingFaceForImages: true,
      temperature: 0.7,
      maxTokens: 1024,
      topP: 0.95,
      presencePenalty: 0.0,
      frequencyPenalty: 0.0,
    },
    apiKeys: {
      googleApiKey: "",
      huggingFaceApiKey: "",
    },
    contextSettings: {
      systemPromptMaxTokens: 2048,
      userPromptMaxTokens: 4096,
      maxMessagesInContext: 10,
      includeTimestamps: true,
      includeUserInfo: false,
    },
    safetySettings: {
      enableContentFiltering: true,
      blockUnsafeContent: true,
      contentCategories: [
        {
          name: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          name: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          name: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          name: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    },
    knowledgeBaseSettings: {
      enableKnowledgeBase: true,
      maxSourcesPerQuery: 5,
      minRelevanceScore: 0.7,
      combineStrategy: "merge_with_model",
    },
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would fetch from the backend
        // const response = await adminApi.getAIConfiguration();
        // setConfig(response.data);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching AI configuration:", err);
        setError("Failed to load AI configuration");
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      // In a real implementation, this would save to the backend
      // await adminApi.saveAIConfiguration(config);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setSaving(false);
    } catch (err) {
      console.error("Error saving AI configuration:", err);
      setError("Failed to save AI configuration");
      setSaving(false);
    }
  };

  const updateModelConfig = (key: keyof typeof config.models, value: any) => {
    setConfig({
      ...config,
      models: {
        ...config.models,
        [key]: value,
      },
    });
  };

  const updateApiKeys = (key: keyof typeof config.apiKeys, value: string) => {
    setConfig({
      ...config,
      apiKeys: {
        ...config.apiKeys,
        [key]: value,
      },
    });
  };

  const updateContextSettings = (
    key: keyof typeof config.contextSettings,
    value: any,
  ) => {
    setConfig({
      ...config,
      contextSettings: {
        ...config.contextSettings,
        [key]: value,
      },
    });
  };

  const updateSafetySettings = (
    key: keyof typeof config.safetySettings,
    value: any,
  ) => {
    setConfig({
      ...config,
      safetySettings: {
        ...config.safetySettings,
        [key]: value,
      },
    });
  };

  const updateKnowledgeBaseSettings = (
    key: keyof typeof config.knowledgeBaseSettings,
    value: any,
  ) => {
    setConfig({
      ...config,
      knowledgeBaseSettings: {
        ...config.knowledgeBaseSettings,
        [key]: value,
      },
    });
  };

  const updateContentCategory = (index: number, field: string, value: any) => {
    const updatedCategories = [...config.safetySettings.contentCategories];
    updatedCategories[index] = {
      ...updatedCategories[index],
      [field]: value,
    };

    setConfig({
      ...config,
      safetySettings: {
        ...config.safetySettings,
        contentCategories: updatedCategories,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading AI configuration...</p>
      </div>
    );
  }

  const modelOptions = [
    { value: "gemini-pro", label: "Gemini Pro" },
    { value: "gemini-pro-vision", label: "Gemini Pro Vision" },
    {
      value: "huggingface/mistralai/Mistral-7B-Instruct-v0.2",
      label: "Mistral 7B",
    },
    { value: "huggingface/meta-llama/Llama-2-7b-chat-hf", label: "Llama 2 7B" },
    { value: "huggingface/google/flan-t5-xxl", label: "Flan-T5 XXL" },
  ];

  const thresholdOptions = [
    { value: "BLOCK_NONE", label: "Allow All" },
    { value: "BLOCK_ONLY_HIGH", label: "Block High" },
    { value: "BLOCK_MEDIUM_AND_ABOVE", label: "Block Medium & High" },
    { value: "BLOCK_LOW_AND_ABOVE", label: "Block All" },
  ];

  const combineStrategyOptions = [
    { value: "merge_with_model", label: "Merge with Model Response" },
    { value: "replace_model", label: "Replace Model Response" },
    { value: "append_sources", label: "Append Sources Only" },
    { value: "custom", label: "Custom Template" },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">AI Configuration</h1>
        <div className="flex items-center gap-2">
          {success && (
            <span className="text-green-500">
              Configuration saved successfully!
            </span>
          )}
          {error && <span className="text-destructive">{error}</span>}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="models">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="context">Context</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
        </TabsList>

        {/* Models Tab */}
        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="primary-model">Primary Model</Label>
                <Select
                  value={config.models.primary}
                  onValueChange={(value) => updateModelConfig("primary", value)}
                >
                  <SelectTrigger id="primary-model">
                    <SelectValue placeholder="Select primary model" />
                  </SelectTrigger>
                  <SelectContent>
                    {modelOptions.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  The main AI model used for generating responses
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fallback-model">Fallback Model</Label>
                <Select
                  value={config.models.fallback}
                  onValueChange={(value) =>
                    updateModelConfig("fallback", value)
                  }
                >
                  <SelectTrigger id="fallback-model">
                    <SelectValue placeholder="Select fallback model" />
                  </SelectTrigger>
                  <SelectContent>
                    {modelOptions.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Used when the primary model fails or is unavailable
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="use-huggingface-images">
                    Use Hugging Face for Images
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Process images with Hugging Face models
                  </p>
                </div>
                <Switch
                  id="use-huggingface-images"
                  checked={config.models.useHuggingFaceForImages}
                  onCheckedChange={(checked) =>
                    updateModelConfig("useHuggingFaceForImages", checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature">
                  Temperature: {config.models.temperature}
                </Label>
                <Slider
                  id="temperature"
                  value={[config.models.temperature]}
                  min={0}
                  max={1}
                  step={0.1}
                  onValueChange={(value) =>
                    updateModelConfig("temperature", value[0])
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Controls randomness (0 = deterministic, 1 = creative)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-tokens">
                  Max Tokens: {config.models.maxTokens}
                </Label>
                <Slider
                  id="max-tokens"
                  value={[config.models.maxTokens]}
                  min={256}
                  max={4096}
                  step={128}
                  onValueChange={(value) =>
                    updateModelConfig("maxTokens", value[0])
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Maximum number of tokens in the response
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="top-p">Top P: {config.models.topP}</Label>
                <Slider
                  id="top-p"
                  value={[config.models.topP]}
                  min={0.1}
                  max={1}
                  step={0.05}
                  onValueChange={(value) => updateModelConfig("topP", value[0])}
                />
                <p className="text-sm text-muted-foreground">
                  Controls diversity via nucleus sampling
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="presence-penalty">
                    Presence Penalty: {config.models.presencePenalty}
                  </Label>
                  <Slider
                    id="presence-penalty"
                    value={[config.models.presencePenalty]}
                    min={-2}
                    max={2}
                    step={0.1}
                    onValueChange={(value) =>
                      updateModelConfig("presencePenalty", value[0])
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Penalizes repeated tokens
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency-penalty">
                    Frequency Penalty: {config.models.frequencyPenalty}
                  </Label>
                  <Slider
                    id="frequency-penalty"
                    value={[config.models.frequencyPenalty]}
                    min={-2}
                    max={2}
                    step={0.1}
                    onValueChange={(value) =>
                      updateModelConfig("frequencyPenalty", value[0])
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Penalizes frequent tokens
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="google-api-key">Google AI API Key</Label>
                <Input
                  id="google-api-key"
                  type="password"
                  value={config.apiKeys.googleApiKey}
                  onChange={(e) =>
                    updateApiKeys("googleApiKey", e.target.value)
                  }
                  placeholder="Enter your Google AI API key"
                />
                <p className="text-sm text-muted-foreground">
                  Required for Gemini models
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="huggingface-api-key">
                  Hugging Face API Key
                </Label>
                <Input
                  id="huggingface-api-key"
                  type="password"
                  value={config.apiKeys.huggingFaceApiKey}
                  onChange={(e) =>
                    updateApiKeys("huggingFaceApiKey", e.target.value)
                  }
                  placeholder="Enter your Hugging Face API key"
                />
                <p className="text-sm text-muted-foreground">
                  Required for Hugging Face models
                </p>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">API Key Security</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  API keys are stored securely and encrypted in the database.
                  They are never exposed to the client.
                </p>
                <p className="text-sm text-muted-foreground">
                  For maximum security, we recommend using environment variables
                  for production deployments.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Context Tab */}
        <TabsContent value="context" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Context Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="system-prompt-max-tokens">
                  System Prompt Max Tokens:{" "}
                  {config.contextSettings.systemPromptMaxTokens}
                </Label>
                <Slider
                  id="system-prompt-max-tokens"
                  value={[config.contextSettings.systemPromptMaxTokens]}
                  min={256}
                  max={4096}
                  step={256}
                  onValueChange={(value) =>
                    updateContextSettings("systemPromptMaxTokens", value[0])
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Maximum tokens for system instructions
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-prompt-max-tokens">
                  User Prompt Max Tokens:{" "}
                  {config.contextSettings.userPromptMaxTokens}
                </Label>
                <Slider
                  id="user-prompt-max-tokens"
                  value={[config.contextSettings.userPromptMaxTokens]}
                  min={256}
                  max={8192}
                  step={256}
                  onValueChange={(value) =>
                    updateContextSettings("userPromptMaxTokens", value[0])
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Maximum tokens for user messages
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-messages-in-context">
                  Max Messages in Context:{" "}
                  {config.contextSettings.maxMessagesInContext}
                </Label>
                <Slider
                  id="max-messages-in-context"
                  value={[config.contextSettings.maxMessagesInContext]}
                  min={2}
                  max={20}
                  step={1}
                  onValueChange={(value) =>
                    updateContextSettings("maxMessagesInContext", value[0])
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Number of previous messages to include in context
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="include-timestamps">Include Timestamps</Label>
                  <p className="text-sm text-muted-foreground">
                    Add timestamps to messages in context
                  </p>
                </div>
                <Switch
                  id="include-timestamps"
                  checked={config.contextSettings.includeTimestamps}
                  onCheckedChange={(checked) =>
                    updateContextSettings("includeTimestamps", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="include-user-info">Include User Info</Label>
                  <p className="text-sm text-muted-foreground">
                    Add user information to context
                  </p>
                </div>
                <Switch
                  id="include-user-info"
                  checked={config.contextSettings.includeUserInfo}
                  onCheckedChange={(checked) =>
                    updateContextSettings("includeUserInfo", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Safety Tab */}
        <TabsContent value="safety" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Safety Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable-content-filtering">
                    Enable Content Filtering
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Apply content safety filters to AI responses
                  </p>
                </div>
                <Switch
                  id="enable-content-filtering"
                  checked={config.safetySettings.enableContentFiltering}
                  onCheckedChange={(checked) =>
                    updateSafetySettings("enableContentFiltering", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="block-unsafe-content">
                    Block Unsafe Content
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Prevent generation of potentially harmful content
                  </p>
                </div>
                <Switch
                  id="block-unsafe-content"
                  checked={config.safetySettings.blockUnsafeContent}
                  onCheckedChange={(checked) =>
                    updateSafetySettings("blockUnsafeContent", checked)
                  }
                />
              </div>

              {config.safetySettings.enableContentFiltering && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Content Categories</h3>

                  {config.safetySettings.contentCategories.map(
                    (category, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-2 gap-4 items-center p-3 border rounded-md"
                      >
                        <div>
                          <p className="font-medium">
                            {category.name
                              .replace("HARM_CATEGORY_", "")
                              .replace("_", " ")}
                          </p>
                        </div>
                        <div>
                          <Select
                            value={category.threshold}
                            onValueChange={(value) =>
                              updateContentCategory(index, "threshold", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select threshold" />
                            </SelectTrigger>
                            <SelectContent>
                              {thresholdOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge-base" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable-knowledge-base">
                    Enable Knowledge Base
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Use knowledge base for grounding responses
                  </p>
                </div>
                <Switch
                  id="enable-knowledge-base"
                  checked={config.knowledgeBaseSettings.enableKnowledgeBase}
                  onCheckedChange={(checked) =>
                    updateKnowledgeBaseSettings("enableKnowledgeBase", checked)
                  }
                />
              </div>

              {config.knowledgeBaseSettings.enableKnowledgeBase && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="max-sources-per-query">
                      Max Sources Per Query:{" "}
                      {config.knowledgeBaseSettings.maxSourcesPerQuery}
                    </Label>
                    <Slider
                      id="max-sources-per-query"
                      value={[config.knowledgeBaseSettings.maxSourcesPerQuery]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(value) =>
                        updateKnowledgeBaseSettings(
                          "maxSourcesPerQuery",
                          value[0],
                        )
                      }
                    />
                    <p className="text-sm text-muted-foreground">
                      Maximum number of knowledge sources to include
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="min-relevance-score">
                      Min Relevance Score:{" "}
                      {config.knowledgeBaseSettings.minRelevanceScore}
                    </Label>
                    <Slider
                      id="min-relevance-score"
                      value={[config.knowledgeBaseSettings.minRelevanceScore]}
                      min={0.1}
                      max={1}
                      step={0.05}
                      onValueChange={(value) =>
                        updateKnowledgeBaseSettings(
                          "minRelevanceScore",
                          value[0],
                        )
                      }
                    />
                    <p className="text-sm text-muted-foreground">
                      Minimum relevance score for knowledge sources
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="combine-strategy">Combine Strategy</Label>
                    <Select
                      value={config.knowledgeBaseSettings.combineStrategy}
                      onValueChange={(value) =>
                        updateKnowledgeBaseSettings("combineStrategy", value)
                      }
                    >
                      <SelectTrigger id="combine-strategy">
                        <SelectValue placeholder="Select strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        {combineStrategyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      How to combine knowledge with model responses
                    </p>
                  </div>

                  {config.knowledgeBaseSettings.combineStrategy ===
                    "custom" && (
                    <div className="space-y-2">
                      <Label htmlFor="custom-template">Custom Template</Label>
                      <Textarea
                        id="custom-template"
                        placeholder="{{sources}}\n\n{{response}}"
                        rows={4}
                      />
                      <p className="text-sm text-muted-foreground">
                        Use {{ sources }} and {{ response }} as placeholders
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIConfiguration;
